(function($) {
  // functions for handling the path
  // thanks sammy.js
  var PATH_REPLACER = "([^\/]+)",
      PATH_NAME_MATCHER = /:([\w\d]+)/g,
      QUERY_STRING_MATCHER = /\?([^#]*)$/,
      SPLAT_MATCHER = /(\*)/,
      SPLAT_REPLACER = "(.+)",
      _currentPath,
      _lastPath,
      _pathInterval;

  function hashChanged() {
    _currentPath = getPath();
    // if path is actually changed from what we thought it was, then react
    if (_lastPath != _currentPath) {
      _lastPath = _currentPath;
      return triggerOnPath(_currentPath);
    }
  }
  
  $.pathbinder = {
    changeFuns : [],
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
    },
    go : function(path) {
      goPath(path);
      triggerOnPath(path);
    },
    currentPath : function() {
      return getPath();
    },
    onChange : function (fun) {
      $.pathbinder.changeFuns.push(fun);
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
    path = path.replace(/^#/,'');
    $.pathbinder.changeFuns.forEach(function(fun) {fun(path)});
    var pathSpec, path_params, params = {}, param_name, param;
    for (var i=0; i < $.pathbinder.paths.length; i++) {
      pathSpec = $.pathbinder.paths[i];
      // $.log("pathSpec", pathSpec);
      if ((path_params = pathSpec.matcher.exec(path)) !== null) {
        // $.log("path_params", path_params);
        path_params.shift();
        for (var j=0; j < path_params.length; j++) {
          param_name = pathSpec.param_names[j];
          param = decodeURIComponent(path_params[j]);
          if (param_name) {
            params[param_name] = param;
          } else {
            if (!params.splat) params.splat = [];
            params.splat.push(param);
          }
        };
        pathSpec.callback(params);
        // return true; // removed this to allow for multi match
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
    if (newPath) {
      // $.log("goPath", newPath)
      window.location = '#'+newPath;
    }
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
      matcher : new RegExp("^" + path.replace(
        PATH_NAME_MATCHER, PATH_REPLACER).replace(
        SPLAT_MATCHER, SPLAT_REPLACER) + "/?$"),
      template : path.replace(PATH_NAME_MATCHER, function(a, b) {
        return '{{'+b+'}}';
      }).replace(SPLAT_MATCHER, '{{splat}}'),
      callback : callback
    };
  };

  $.fn.pathbinder = function(name, paths, options) {
    options = options || {};
    var self = $(this), pathList = paths.split(/\n/);
    $.each(pathList, function() {
      var path = this;
      if (path) {
        // $.log("bind path", path);
        var pathSpec = makePathSpec(path, function(params) {
          // $.log("path cb", name, path, self)
          // $.log("trigger path: "+path+" params: ", params);
          self.trigger(name, [params]);
        });
        // set the path when the event triggered through other means
        if (options.bindPath) {
          self.bind(name, function(ev, params) {
            params = params || {};
            // $.log("set path", name, pathSpec)
            setPath(pathSpec, params);
          });
        }
        // trigger when the path matches
        registerPath(pathSpec);
      }
    });
  };
})(jQuery);
  