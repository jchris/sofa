function(doc) {
  // include-lib
  if (doc.type == "comment") {
    eval(lib.helpers.md5);
    doc.commenter.gravatar = hex_md5(doc.commenter.email);
    emit([doc.post_id, doc.created_at], doc);
  }  
};