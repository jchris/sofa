function(doc, req) {  
  var path = require("vendor/couchapp/lib/path").init(req);
  var redirect = require("vendor/couchapp/lib/redirect");
  return redirect.permanent(path.list('post','post-page', {startkey : [doc._id]}));
}
