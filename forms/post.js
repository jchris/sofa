
function(doc, req) {  
  // !include lib.templates
  // !require lib.helpers.template

  
  return respondWith(req, {
    html : function() {
      var postHtml = doc.html.replace(/<script(.|\n)*?>/g, '');

      var html = template(lib.templates.post, {
        title : doc.title,
        post : postHtml,
        date : doc.created_at,
        author : doc.author,
        attachments : ['',req.path[0], '_design', req.path[2]].join('/')
      });
      log(doc._id);
      return { body: html };
    },
    xml : function() {
      return {
        body: template('post.e4x', {
          post : postHtml,
          scripts : pageScripts
      })};
    },
    fallback : 'html'
  })
}