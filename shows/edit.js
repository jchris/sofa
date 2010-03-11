function(doc, req) {  
  var ddoc = this;
  var Mustache = require("lib/mustache");
  var path = require("vendor/couchapp/commonjs/path").init(req);

  return Mustache.to_html(ddoc.templates.edit, {
    doc : doc,
    docid : JSON.stringify((doc && doc._id) || null), 
    blog : ddoc.blog,
    assets : path.asset(),
    index : path.list('index','recent-posts',{descending:true,limit:8})
  });
}
