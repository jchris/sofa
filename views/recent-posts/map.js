function(doc) {
  if (doc.type == "post") {
    emit(new Date(doc.created_at), {
      body : doc.body,
      title : doc.title,
      author : doc.author,
      created_at : doc.created_at
    });
  }
};
