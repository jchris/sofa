function(doc, req) {  
  var ddoc = this;
  var Mustache = require("lib/mustache");
  var path = require("vendor/couchapp/lib/path").init(req);

  return Mustache.to_html(ddoc.templates.edit, {
    header : {
      index : path.list('index','recent-posts',{descending:true,limit:5}),
      blogName : ddoc.blog.title
    },
    doc : doc,
    docid : JSON.stringify((doc && doc._id) || null),
    pageTitle : doc ? "Edit: "+doc.title : "Create a new post",
    assets : path.asset()
  }, ddoc.templates.partials);
}
