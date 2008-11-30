function(doc) {
  // only posts have slugs, dates, and bodies
  if (doc.created_at && doc.slug && doc.body && doc.title) {
    var summary = (doc.body.substring(0,350) + '...').replace(/<(.|\n)*?>/g, '');
    emit(doc.created_at, {
      summary : summary,
      title : doc.title,
      created_at : doc.created_at
    });    
  }

};