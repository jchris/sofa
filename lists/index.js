function(head, req) {
  var ddoc = this;
  var index = this.templates.index;
  var Mustache = require("lib/mustache");
  var List = require("vendor/couchapp/list")

  // !code vendor/couchapp/path.js
  // !code vendor/couchapp/date.js
  // !code vendor/couchapp/template.js
  // !code lib/atom.js

  var indexPath = listPath('index','recent-posts',{descending:true, limit:5});
  var feedPath = listPath('index','recent-posts',{descending:true, limit:5, format:"atom"});

  // The provides function serves the format the client requests.
  // The first matching format is sent, so reordering functions changes 
  // thier priority. In this case HTML is the preferred format, so it comes first.
  provides("html", function() {
    // render the html head using a template
    var stash = {
      title : ddoc.blog.title,
      feedPath : feedPath,
      newPostPath : showPath("edit"),
      index : indexPath,
      assets : assetPath(),
      posts : getRows
    };
    
    send(Mustache.to_html(index, stash));
    
    // loop over view rows, rendering one at a time
    var row, key;
    while (row = getRow()) {
      var post = row.value;
      key = row.key;
      send(Mustache.to_html(index.row, {
        title : post.title,
        summary : post.summary,
        date : post.created_at,
        link : showPath('post', row.id)
      }));        
    }
    
    // render the html tail template
    return Mustache.to_html(templates.index.tail, {
      assets : assetPath(),
      older : olderPath(key)
    });
  });

  // if the client requests an atom feed and not html, 
  // we run this function to generate the feed.
  provides("atom", function() {
    // we load the first row to find the most recent change date
    var row = getRow();
    
    // generate the feed header
    var feedHeader = Atom.header({
      updated : (row ? new Date(row.value.created_at) : new Date()),
      title : blog.title,
      feed_id : makeAbsolute(req, indexPath),
      feed_link : makeAbsolute(req, feedPath),
    });
    
    // send the header to the client
    send(feedHeader);

    // loop over all rows
    if (row) {
      do {
        // generate the entry for this row
        var feedEntry = Atom.entry({
          entry_id : makeAbsolute(req, '/'+encodeURIComponent(req.info.db_name)+'/'+encodeURIComponent(row.id)),
          title : row.value.title,
          content : row.value.html,
          updated : new Date(row.value.created_at),
          author : row.value.author,
          alternate : makeAbsolute(req, showPath('post', row.id))
        });
        // send the entry to client
        send(feedEntry);
      } while (row = getRow());
    }

    // close the loop after all rows are rendered
    return "</feed>";
  });
};