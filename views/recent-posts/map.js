function(doc) {
  // only posts have slugs, dates, and html
  if (doc.type == "post") {
    emit(doc.created_at, {
      html : doc.html,
      title : doc.title,
      author : doc.author,
      created_at : doc.created_at
    });    
  }
};