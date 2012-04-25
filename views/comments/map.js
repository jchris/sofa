function(doc) {  
  var comments = require("views/lib/comments");
  
  if (doc.type == "comment") {
    emit(new Date(doc.created_at), comments.withGravatar(doc));
  }
};