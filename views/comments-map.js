function(doc) {
  if (doc.type == "comment") 
    emit([doc.post_id, doc.created_at], doc);
};