function(head, req) {
  var ddoc = this;
  var Mustache = require("lib/mustache");
  var List = require("vendor/couchapp/commonjs/list");
  var path = require("vendor/couchapp/commonjs/path").init(req);
  var Atom = require("vendor/couchapp/commonjs/atom");

  var indexPath = path.list('index','recent-posts',{descending:true, limit:5});
  var feedPath = path.list('index','recent-posts',{descending:true, limit:5, format:"atom"});


  // The provides function serves the format the client requests.
  // The first matching format is sent, so reordering functions changes 
  // thier priority. In this case HTML is the preferred format, so it comes first.
  provides("html", function() {
    var key = "";
    // render the html head using a template
    var stash = {
      header : {
        index : indexPath,
        blogName : ddoc.blog.title
      },
      feedPath : feedPath,
      newPostPath : path.show("edit"),
      assets : path.asset(),
      posts : List.withRows(function(row) {
        var post = row.value;
        key = row.key;
        return {
          title : post.title,
          summary : post.summary,
          date : post.created_at,
          link : path.list('post','post-page', {startkey : [row.id]})
        };
      }),
      older : function() {
        return path.older(key);
      },
      "5" : path.limit(5),
      "10" : path.limit(10),
      "25" : path.limit(25)
    };
    return Mustache.to_html(ddoc.templates.index, stash, ddoc.templates.partials, send);
  });

  // if the client requests an atom feed and not html, 
  // we run this function to generate the feed.
  provides("atom", function() {
    // we load the first row to find the most recent change date
    var row = getRow();
    
    // generate the feed header
    var feedHeader = Atom.header({
      updated : (row ? new Date(row.value.created_at) : new Date()),
      title : ddoc.blog.title,
      feed_id : path.absolute(indexPath),
      feed_link : path.absolute(feedPath),
    });
    
    // send the header to the client
    send(feedHeader);

    // loop over all rows
    if (row) {
      do {
        // generate the entry for this row
        var feedEntry = Atom.entry({
          entry_id : path.absolute('/'+encodeURIComponent(req.info.db_name)+'/'+encodeURIComponent(row.id)),
          title : row.value.title,
          content : row.value.html,
          updated : new Date(row.value.created_at),
          author : row.value.author,
          alternate : path.absolute(path.show('post', row.id))
        });
        // send the entry to client
        send(feedEntry);
      } while (row = getRow());
    }

    // close the loop after all rows are rendered
    return "</feed>";
  });
};