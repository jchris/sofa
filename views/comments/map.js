function(doc) {
  // !code helpers.md5
  if (doc.type == "comment") {
    doc.commenter.gravatar = hex_md5(doc.commenter.email);
    emit([doc.post_id, doc.created_at], doc);
  }  
};