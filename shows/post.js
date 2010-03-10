function(doc, req) {  
  var path = require("vendor/couchapp/commonjs/path").init(req);
  var redirect = require("vendor/couchapp/commonjs/redirect");
  return redirect.permanent(path.list('post','post-page', {startkey : [doc._id]}));
}
