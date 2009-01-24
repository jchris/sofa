function(head, row, req) {
  // !json lib.templates.index
  // !json blog
  // !code lib.helpers.template
  respondWith(req, {
    html : function() {
      if (head) {
        return template(lib.templates.index.head, {
          title : blog.title,
          assets : ['',req.path[0], '_design', req.path[2]].join('/')
        });
      } else if (row) {
        var post = row.value;
        return template(lib.templates.index.row, {
          title : post.title,
          summary : post.summary,
          date : post.created_at,
          path : ['',req.path[0], '_show', req.path[2], 'post', row.id].join('/'),
          assets : ['',req.path[0], '_design', req.path[2]].join('/')
        });
      } else {
        return '</ul></html>';
      }
    },
    xml : function() {
      if (head) {
        return {body:'<feed xmlns="http://www.w3.org/2005/Atom">'
          +'<title>Test XML Feed</title>'};
      } else if (row) {
        // Becase Safari can't stand to see that dastardly
        // E4X outside of a string. Outside of tests you
        // can just use E4X literals.
        var entry = new XML('<entry/>');
        entry.id = row.id;
        entry.title = row.key;
        entry.content = row.value;
        return {body:entry};
      } else {
        return {body : "</feed>"};
      }
    }
  })
};