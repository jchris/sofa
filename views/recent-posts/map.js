function(doc) {
  if (doc.type == "post") {
    emit(doc.created_at, doc);
  }
};
