function(doc) {
  if (doc.type == "post") {
    emit([doc._id], doc);
  } else if (doc.type == "comment") {
    emit([doc.post_id, doc.created_at], doc);
  }
};