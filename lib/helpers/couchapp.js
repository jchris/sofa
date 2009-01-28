// this stuff should be properly namespaced etc

// from couch.js
function encodeOptions(options) {
  var buf = []
  if (typeof(options) == "object" && options !== null) {
    for (var name in options) {
      if (!options.hasOwnProperty(name)) continue;
      var value = options[name];
      if (name == "key" || name == "startkey" || name == "endkey") {
        value = toJSON(value);
      }
      buf.push(encodeURIComponent(name) + "=" + encodeURIComponent(value));
    }
  }
  if (!buf.length) {
    return "";
  }
  return "?" + buf.join("&");
}

function concatArgs(array, args) {
  for (var i=0; i < args.length; i++) {
    array.push(args[i]);
  };
  return array;
};

function makePath(array) {
  var options, path;
  
  if (typeof array[array.length - 1] != "string") {
    // it's a params hash
    options = array.pop();
    log({options:options});
  }
  path = array.join('/');
  if (options) {
    return path + encodeOptions(options);
  } else {
    return path;    
  }
};

function assetPath() {
  var parts = ['',req.path[0], '_design', req.path[2]];
  return makePath(concatArgs(parts, arguments));
};

function showPath() {
  var parts = ['',req.path[0], '_show', req.path[2]];
  return makePath(concatArgs(parts, arguments));
};

function listPath() {
  var parts = ['',req.path[0], '_list', req.path[2]];
  return makePath(concatArgs(parts, arguments));
};