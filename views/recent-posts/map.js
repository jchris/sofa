function(doc) {
  if (doc.type == "post") {
    emit(new Date(doc.created_at), doc);
  }
};
