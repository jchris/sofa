function(doc) {
  // only posts have slugs, dates, and html
  if (doc.type == "post") {
    var summary = (doc.html.substring(0,350) + '...').replace(/<(.|\n)*?>/g, '');
    emit(doc.created_at, {
      summary : summary,
      title : doc.title,
      created_at : doc.created_at
    });    
  }
};