// Helpers for writing server-side _list functions in CouchDB
exports.withRows = function(fun) {
 var f = function() {
    var row = getRow();
    return row && fun(row);
  };
  f.iterator = true;
  return f;
}

exports.send = function(chunk) {
  send(chunk + "\n")
}