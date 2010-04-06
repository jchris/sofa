function(head, req) {
  var Mustache = require("lib/mustache");
  var ddoc = this;
  var List = require("vendor/couchapp/lib/list");
  var path = require("vendor/couchapp/lib/path").init(req);
  var markdown = require("vendor/couchapp/lib/markdown");
  var textile = require("vendor/textile/textile");

  var indexPath = path.list('index','recent-posts',{descending:true, limit:10});
  var feedPath = path.list('index','recent-posts',{descending:true, limit:10, format:"atom"});
  var commentsFeed = path.list('comments','comments',{descending:true, limit:10, format:"atom"});
  
  provides("html", function() {
    // get the first row and make sure it's a post
    var post = getRow().value;
    if (post.type != "post") {
      throw(["error", "not_found", "not a post"]);
    } else {
      if (post.format == "markdown") {
        var html = markdown.encode(post.body);
      } else if (post.format == "textile") {
        var html = textile.encode(post.body);
      } else {
        var html = Mustache.escape(post.html);
      }

      var stash = {
        header : {
          index : indexPath,
          blogName : ddoc.blog.title,
          feedPath : feedPath,
          commentsFeed : commentsFeed
        },
        scripts : {},
        title : post.title,
        post_id : post._id,
        date : post.created_at,
        html : html,
        comments : List.withRows(function(row) {
          var v = row.value;
          if (v.type != "comment") {
            return;
          }
          // keep getting comments until we get to the next post...
          return {
            comment : {
              name : v.commenter.nickname || v.commenter.name,
              url : v.commenter.url,
              avatar : v.commenter.gravatar_url || 'http://www.gravatar.com/avatar/'+v.commenter.gravatar+'.jpg?s=40&d=identicon',
              html : markdown.encode(Mustache.escape(v.comment)),
              created_at : v.created_at
            }
          };
        })
      };
      return Mustache.to_html(ddoc.templates.post, stash, ddoc.templates.partials, List.send);   
    }
  });
}

