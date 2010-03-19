function(head, req) {
  var Mustache = require("lib/mustache");
  var ddoc = this;
  var List = require("vendor/couchapp/commonjs/list");
  var path = require("vendor/couchapp/commonjs/path").init(req);
  var markdown = require("vendor/markdown/lib/markdown");

  var indexPath = path.list('index','recent-posts',{descending:true, limit:5});
  
  provides("html", function() {
    // get the first row and make sure it's a post
    var post = getRow().value;
    if (post.type != "post") {
      throw("not a post");
    } else {
      var stash = {
        header : {
          index : indexPath,
          blogName : ddoc.blog.title
        },
        title : post.title,
        date : post.created_at,
        html : markdown.encode(post.body),
        comments : List.withRows(function(row) {
          var v = row.value;
          if (v.type != "comment") {
            return;
          }
          log("v")
          log(v)
          // keep getting comments until we get to the next post...
          return {
            name : v.commenter.name,
            url : v.commenter.url,
            avatar : 'http://www.gravatar.com/avatar/'+v.commenter.gravatar+'.jpg?s=40&d=identicon',
            html : markdown.encode(v.comment),
            created_at : v.created_at
          };
        })
      };
      return Mustache.to_html(ddoc.templates.post, stash, ddoc.templates.partials, send);   
    }
  });
}

