function(doc, req) {  
  var ddoc = this;
  var Mustache = require("lib/mustache");
  var path = require("vendor/couchapp/lib/path").init(req);

  var indexPath = path.list('index','recent-posts',{descending:true, limit:10});
  var feedPath = path.list('index','recent-posts',{descending:true, limit:10, format:"atom"});
  var commentsFeed = path.list('comments','comments',{descending:true, limit:10, format:"atom"});

  return Mustache.to_html(ddoc.templates.edit, {
    header : {
      index : indexPath,
      blogName : ddoc.blog.title,
      feedPath : feedPath,
      commentsFeed : commentsFeed
    },
    doc : doc,
    docid : JSON.stringify((doc && doc._id) || null),
    pageTitle : doc ? "Edit: "+doc.title : "Create a new post",
    assets : path.asset()
  }, ddoc.templates.partials);
}
