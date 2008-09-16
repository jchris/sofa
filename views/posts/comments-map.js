function(doc) {
  if (doc.date && doc.comment && doc.postid) emit([doc.postid, doc.date], doc);
};