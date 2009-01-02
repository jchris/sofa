function(doc, req) {  
  //include-lib
  
  respondWith(req, {
    html : function() {
      var pageScripts = template('post.js',{id : docid});

      var postHtml = doc.html.replace(/<script(.|\n)*?>/g, '');

      var html = runTemplate('post.html', {
        title : doc.title,
        post : postHtml,
        author : doc.author,
        scripts : pageScripts
      });

      return { body: html };
    },
    xml : function() {
      return {
        body: template('post.e4x', {
          post : postHtml,
          scripts : pageScripts
      })};
    }
  })
}