function(doc) {
  if (doc.type == "post") {
    var summary = (doc.html.replace(/<(.|\n)*?>/g, '').substring(0,350) + '...');
    emit(doc.created_at, {
      html : doc.html,
      summary : summary,
      title : doc.title,
      author : doc.author,
      created_at : doc.created_at
    });    
  }
};