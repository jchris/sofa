function concatArgs(array, args) {
  for (var i=0; i < args.length; i++) {
    array.push(args[i]);
  };
  return array;
};

function assetPath() {
  var parts = ['',req.path[0], '_design', req.path[2]];
  return concatArgs(parts, arguments).join('/');
};

function showPath() {
  var parts = ['',req.path[0], '_show', req.path[2]];
  return concatArgs(parts, arguments).join('/');
};

function listPath() {
  var parts = ['',req.path[0], '_list', req.path[2]];
  return concatArgs(parts, arguments).join('/');
};