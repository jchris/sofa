function(doc) {
  if (doc.date && doc.body) emit(doc.date, doc);
};