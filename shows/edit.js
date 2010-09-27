function(doc, req) {  
  var ddoc = this;
  var Mustache = require("lib/mustache");
  var path = require("vendor/couchapp/lib/path").init(req);

  var indexPath = path.list('index','recent-posts',{descending:true, limit:10});
  var feedPath = path.list('index','recent-posts',{descending:true, limit:10, format:"atom"});
  var commentsFeed = path.list('comments','comments',{descending:true, limit:10, format:"atom"});

  var data = {
    header : {
      index : indexPath,
      blogName : ddoc.blog.title,
      feedPath : feedPath,
      commentsFeed : commentsFeed
    },
    scripts : {},
    pageTitle : doc ? "Edit: "+doc.title : "Create a new post",
    assets : path.asset()
  };
  
  if (doc) {
    data.doc = JSON.stringify(doc);
    data.title = doc.title;
    data.body = doc.body;
    data.tags = doc.tags.join(", ");
  } else {
    data.doc = JSON.stringify({
      type : "post",
      format : "markdown"
    });
  }

  return Mustache.to_html(ddoc.templates.edit, data, ddoc.templates.partials);
}
