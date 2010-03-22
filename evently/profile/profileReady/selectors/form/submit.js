function() {
  var f = $(this);
  
  var commentForm = app.docForm("form#new-comment", {
    fields : [
      "commenter-name", 
      "commenter-email", 
      "commenter-url", 
      "comment"
    ],
    template : {
      type : "comment",
      post_id : "{{post_id}}",
      format : "markdown"
    },
    beforeSave : function(doc) {
      doc.created_at = new Date();
    },
    success : function(resp, doc) {
      $("#new-comment").html('<h2>Success! Your comment has posted.</h2><p>Refresh the page to see it.</p>');
    }
  });
  
  return false;
};


