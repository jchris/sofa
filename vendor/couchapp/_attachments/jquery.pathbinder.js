(function($) {
  // functions for handling the path
  // thanks sammy.js
  var PATH_REPLACER = "([^\/]+)",
      PATH_NAME_MATCHER = /:([\w\d]+)/g,
      QUERY_STRING_MATCHER = /\?([^#]*)$/,
      _currentPath,
      _lastPath,
      _pathInterval;

  function hashChanged() {
    _currentPath = getPath();
    // if path is actually changed from what we thought it was, then react
    if (_lastPath != _currentPath) {
      return triggerOnPath(_currentPath);
    }
  }
  
  $.pathbinder = {
    paths : [],
    begin : function(defaultPath) {
      // this should trigger the defaultPath if there's not a path in the URL
      // otherwise it should trigger the URL's path
      $(function() {
        var loadPath = getPath();
        if (loadPath) {
          triggerOnPath(loadPath);
        } else {
          goPath(defaultPath);          
          triggerOnPath(defaultPath);
        }
      })
    }
  };

  function pollPath(every) {
    function hashCheck() {        
      _currentPath = getPath();
      // path changed if _currentPath != _lastPath
      if (_lastPath != _currentPath) {
        setTimeout(function() {
          $(window).trigger('hashchange');
        }, 1);
      }
    };
    hashCheck();
    _pathInterval = setInterval(hashCheck, every);
    $(window).bind('unload', function() {
      clearInterval(_pathInterval);
    });
  }

  function triggerOnPath(path) {
    var pathSpec, path_params, params = {};
    for (var i=0; i < $.pathbinder.paths.length; i++) {
      pathSpec = $.pathbinder.paths[i];
      if ((path_params = pathSpec.matcher.exec(path)) !== null) {
        path_params.shift();
        for (var j=0; j < path_params.length; j++) {
          params[pathSpec.param_names[j]] = decodeURIComponent(path_params[j]);
        };
        // $.log("path trigger for "+path);
        pathSpec.callback(params);
        return true;
      }
    };
  };

  // bind the event
  $(function() {
    if ('onhashchange' in window) {
      // we have a native event
    } else {
      pollPath(10);
    }
    // setTimeout(hashChanged,50);
    $(window).bind('hashchange', hashChanged);
  });

  function registerPath(pathSpec) {
    $.pathbinder.paths.push(pathSpec);
  };

  function setPath(pathSpec, params) {
    var newPath = $.mustache(pathSpec.template, params);
    goPath(newPath);
  };
  
  function goPath(newPath) {
    window.location = '#'+newPath;
    _lastPath = getPath();
  };
  
  function getPath() {
    var matches = window.location.toString().match(/^[^#]*(#.+)$/);
    return matches ? matches[1] : '';
  };

  function makePathSpec(path, callback) {
    var param_names = [];
    var template = "";
    
    PATH_NAME_MATCHER.lastIndex = 0;
    
    while ((path_match = PATH_NAME_MATCHER.exec(path)) !== null) {
      param_names.push(path_match[1]);
    }

    return {
      param_names : param_names,
      matcher : new RegExp(path.replace(PATH_NAME_MATCHER, PATH_REPLACER) + "$"),
      template : path.replace(PATH_NAME_MATCHER, function(a, b) {
        return '{{'+b+'}}';
      }),
      callback : callback
    };
  };

  $.fn.pathbinder = function(name, path) {
    var self = $(this);
    var pathSpec = makePathSpec(path, function(params) {
      // $.log("path cb", name, path, self)
      self.trigger(name, [params]);
    });
    self.bind(name, function(ev, params) {
      // set the path when triggered
      // $.log("set path", name, pathSpec)
      setPath(pathSpec, params);
    });
    // trigger when the path matches
    registerPath(pathSpec);
  };
})(jQuery);
  