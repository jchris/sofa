function() {
  var f = $(this), app = $$(this).app;
  var newComment = {
    type : "comment",
    post_id : app.post_id,
    format : "markdown",
    comment : $("[name=comment]", f).val(),
    commenter : $$("#profile").profile,
    created_at : new Date()
  };
  app.db.saveDoc(newComment, {
    success : function(resp) {
      $("#new-comment").html('<h2>Success! Your comment has posted.</h2><p>Refresh the page to see it.</p>');
    }
  });
  
  return false;
};


