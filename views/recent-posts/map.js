function(doc) {
  // !code _attachments/showdown.js
  
  if (doc.format == "textile") {
    if (doc.html) {
      var html = doc.html;      
    } else {
      var html = "editing textile documents is not yet implemented. please convert to Markdown";
    }
  } else if (doc.format == "markdown") {
    var converter = new Showdown.converter();
    var html = converter.makeHtml(doc.body);
  }
  if (doc.type == "post") {
    var summary = (html.replace(/<(.|\n)*?>/g, '').substring(0,350) + '...');
    emit(doc.created_at, {
      html : html,
      summary : summary,
      title : doc.title,
      author : doc.author,
      created_at : doc.created_at
    });
  }
};
