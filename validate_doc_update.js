function (newDoc, oldDoc, userCtx) {
  // !code lib/validate.js 

  unchanged("type");
  unchanged("author");
  unchanged("created_at");
  
  if (newDoc.created_at) dateFormat("created_at");

  // docs with authors can only be saved by their author
  // admin can author anything...
  if (!isAdmin(userCtx) && newDoc.author && newDoc.author != userCtx.name) {    
      unauthorized("Only "+newDoc.author+" may edit this document.");
  }

  // authors and admins can always delete
  if (newDoc._deleted) return true;
    
  if (newDoc.type == 'post') {
    require("created_at", "author", "body", "html", "format", "title", "slug");
    assert(newDoc.slug == newDoc._id, "Post slugs must be used as the _id.")

  } else if (newDoc.type == 'comment') {
    require("created_at", "post_id", "comment", "html", "format", "commenter");
    assert(newDoc.commenter.name && newDoc.commenter.email, 
      "Comments must include name and email.");
    if (newDoc.commenter.url) {      
      assert(newDoc.commenter.url.match(/^https?:\/\/[^.]*\..*/), 
        "Commenter URL must start with http://.");      
    }
  }
}
