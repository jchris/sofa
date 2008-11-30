function(doc) {
  if (doc.created_at && doc.html && doc.post_id) 
    emit([doc.post_id, doc.created_at], doc);
};