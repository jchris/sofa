function(head, req) {
  // !json templates.index
  // !json blog
  // !code vendor/couchapp/path.js
  // !code vendor/couchapp/date.js
  // !code vendor/couchapp/template.js

  var indexPath = listPath('index','recent-posts',{descending:true, limit:5});
  var feedPath = listPath('index','recent-posts',{descending:true, limit:5, format:"atom"});

  // using the provides function to serve the format the client requests
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
    // two helper functions, extracted for readability
    function makeHeader(updated) {
      var f = <feed xmlns="http://www.w3.org/2005/Atom"/>;
      f.title = blog.title;
      f.id = makeAbsolute(req, indexPath);
      f.link.@href = makeAbsolute(req, feedPath);
      f.link.@rel = "self";
      f.generator = "Sofa on CouchDB";
      f.updated = updated.rfc3339();
      return f.toXMLString().replace(/\<\/feed\>/,''); 
    };
    
    function makeEntry(row) {
      var entry = <entry/>;
      entry.id = makeAbsolute(req, '/'+encodeURIComponent(req.info.db_name)+'/'+encodeURIComponent(row.id));
      entry.title = row.value.title;
      entry.content = row.value.html;
      entry.content.@type = 'html';
      entry.updated = new Date(row.value.created_at).rfc3339();
      entry.author = <author><name>{row.value.author}</name></author>;
      entry.link.@href = makeAbsolute(req, showPath('post', row.id));
      entry.link.@rel = "alternate";
      return entry;
    };
    
    // we load the first row to find the most recent change date
    var row = getRow();
    send(makeHeader(row ? new Date(row.value.created_at) : new Date()));

    // loop over all rows
    if (row) {
      send(makeEntry(row));
      while (row = getRow()) {
        send(makeEntry(row));
      }
    }

    // close the loop after all rows are rendered
    return "</feed>";
  });
};