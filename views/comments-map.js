function(doc) {
  if (doc.created_at && doc.body && doc.post_id) 
    emit([doc.post_id, doc.created_at], doc);
};