function(doc) {
  // !code helpers/md5.js
  if (doc.type == "comment") {
    if (doc.commenter && doc.commenter.email && !doc.commenter.gravatar_url) {
      // todo normalize this schema-ness
      doc.commenter.gravatar = hex_md5(doc.commenter.email);      
    }
    emit(doc.created_at, doc);
  }
};