function(doc) {
  if (doc.date && doc.comment) emit(doc.date, doc);
};