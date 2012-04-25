function(doc) {
  var comments = require("views/lib/comments");
  
  if (doc.type == "post") {
    emit([doc._id], doc);
  } else if (doc.type == "comment") {
    emit([doc.post_id, doc.created_at], comments.withGravatar(doc));
  }
};