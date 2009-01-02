function(doc) {
  // only posts have slugs, dates, and html
  if (doc.type == "post") {
    var summary = (doc.html.replace(/<(.|\n)*?>/g, '').substring(0,350) + '...');
    emit(doc.created_at, {
      summary : summary,
      title : doc.title,
      created_at : doc.created_at
    });    
  }
};