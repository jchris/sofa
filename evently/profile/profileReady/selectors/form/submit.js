function() {
  var f = $(this);
  var docForm = $$(this).app.require("vendor/couchapp/docform");

  var newComment = docForm.applyFields(f, [
    "commenter-name", 
    "commenter-email", 
    "commenter-url", 
    "comment"
  ], {
    type : "comment",
    post_id : "post_id",
    format : "markdown",
    created_at : new Date()
  });
  
  

  docForm.onSubmit({
    type : "comment",
    post_id : "{{post_id}}",
    format : "markdown"
  }, {
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
  })

  
  return false;
};


