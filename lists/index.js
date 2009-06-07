function atom() {
  
};

function(head, req) {
  // !json templates.index
  // !json blog
  // !code vendor/couchapp/path.js
  // !code vendor/couchapp/date.js
  // !code vendor/couchapp/template.js

  var indexPath = listPath('index','recent-posts',{descending:true, limit:5});
  var feedPath = listPath('index','recent-posts',{descending:true, limit:5, format:"atom"});
  return respondWith(req, {
    html : function() {
      send(template(templates.index.head, {
        title : blog.title,
        feedPath : feedPath,
        newPostPath : showPath("edit"),
        index : indexPath,
        assets : assetPath()
      }));
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
      return template(templates.index.tail, {
        assets : assetPath(),
        older : olderPath(key)
      });
    },
    atom : function() {
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
      var f = <feed xmlns="http://www.w3.org/2005/Atom"/>;
      f.title = blog.title;
      f.id = makeAbsolute(req, indexPath);
      f.link.@href = makeAbsolute(req, feedPath);
      f.link.@rel = "self";
      f.generator = 'Sofa on CouchDB';
      var row = getRow();
      var date = row ? new Date(row.value.created_at) : new Date();
      f.updated = date.rfc3339();
      send(f.toXMLString().replace(/\<\/feed\>/,''));
      row && send(makeEntry(row));
      while (row = getRow()) {
        send(makeEntry(row));
      }
      return "</feed>";
    }
  })
};