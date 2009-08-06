function(head, req) {
  // !json templates.index
  // !json blog
  // !code vendor/couchapp/path.js
  // !code vendor/couchapp/date.js
  // !code vendor/couchapp/template.js
  // !code lib/atom.js

  var indexPath = listPath('index','recent-posts',{descending:true, limit:5});
  var feedPath = listPath('index','recent-posts',{descending:true, limit:5, format:"atom"});

  // the provides function to serve the format the client requests
  // the first matching format is sent, so reordering functions changes 
  // thier priority.
  provides("html", function() {
    // render the html head using a template
    send(template(templates.index.head, {
      title : blog.title,
      feedPath : feedPath,
      newPostPath : showPath("edit"),
      index : indexPath,
      assets : assetPath()
    }));
    
    // loop over view rows, rendering one at a time
    var row, key;
    while (row = getRow()) {
      var post = row.value;
      key = row.key;
      send(template(templates.index.row, {
        title : post.title,
        summary : post.summary,
        date : post.created_at,
        link : showPath('post', row.id),
        assets : assetPath()
      }));        
    }
    
    // render the html tail template
    return template(templates.index.tail, {
      assets : assetPath(),
      older : olderPath(key)
    });
  });

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
        var feedEntry = Atom.entry({
          entry_id : makeAbsolute(req, '/'+encodeURIComponent(req.info.db_name)+'/'+encodeURIComponent(row.id)),
          title : row.value.title,
          content : row.value.html,
          updated : new Date(row.value.created_at).rfc3339(),
          author : row.value.author,
          alternate : makeAbsolute(req, showPath('post', row.id))
        });
        send(feedEntry);
      } while (row = getRow());
    }

    // close the loop after all rows are rendered
    return "</feed>";
  });
};