function(head, row, req, info) {
  // !json templates.index
  // !json blog
  // !code helpers.couchapp
  // !code helpers.template

  function olderPath(info) {
    if (!info) return null;
    var q = req.query;
    q.startkey = info.prev_key;
    q.skip=1;
    return listPath('index','recent-posts',q);
  }

  var indexPath = listPath('index','recent-posts',{descending:true, limit:8});
  var feedPath = listPath('index','recent-posts',{descending:true, limit:8, format:"atom"});
  return respondWith(req, {
    html : function() {
      if (head) {
        return template(templates.index.head, {
          title : blog.title,
          newPostPath : showPath("edit"),
          index : indexPath,
          assets : assetPath()
        });
      } else if (row) {
        var post = row.value;
        return template(templates.index.row, {
          title : post.title,
          html : post.html,
          date : post.created_at,
          link : showPath('post', row.id),
          assets : assetPath()
        });
      } else {
        return template(templates.index.tail, {
          assets : assetPath(),
          older : olderPath(info)
        });
      }
    },
    atom : function() {
      // with first row in head you can do updated.
      if (head) {
        var f = <feed xmlns="http://www.w3.org/2005/Atom"/>;
        f.title = blog.title;
        f.id = makeAbsolute(req, indexPath);
        f.link.@href = makeAbsolute(req, feedPath);
        f.link.@rel = "self";
        f.generator = 'Sofa on CouchDB';
        f.updated = new Date().rfc3339();
        return {body:f.toXMLString().replace(/\<\/feed\>/,'')};
      } else if (row) {
        var entry = <entry/>;
        entry.id = makeAbsolute(req, '/'+encodeURIComponent(req.info.db_name)+'/'+encodeURIComponent(row.id));
        entry.title = row.value.title;
        entry.content = row.value.html;
        entry.content.@type = 'html';
        entry.updated = new Date(row.value.created_at).rfc3339();
        entry.author = <author><name>{row.value.author}</name></author>;
        entry.link.@href = makeAbsolute(req, showPath('post', row.id));
        entry.link.@rel = "alternate";
        return {body:entry};
      } else {
        return {body : "</feed>"};
      }
    }
  })
};