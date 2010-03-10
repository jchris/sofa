function (newDoc, oldDoc, userCtx, secObj) {
  var v = require("lib/validate").newValidator(newDoc, oldDoc, userCtx, secObj);

  v.unchanged("type");
  v.unchanged("author");
  v.unchanged("created_at");
  
  if (newDoc.created_at) v.dateFormat("created_at");

  // docs with authors can only be saved by their author
  // admin can author anything...
  if (!isAdmin(userCtx) && newDoc.author && newDoc.author != userCtx.name) {    
    v.unauthorized("Only "+newDoc.author+" may edit this document.");
  }

  // authors and admins can always delete
  if (isAdmin(userCtx) && newDoc._deleted) return true;
    
  if (newDoc.type == 'post') {
    require("created_at", "author", "body", "html", "format", "title", "slug");
    v.assert(newDoc.slug == newDoc._id, "Post slugs must be used as the _id.");

  } else if (newDoc.type == 'comment') {
    v.require("created_at", "post_id", "comment", "html", "format", "commenter");
    assert(newDoc.commenter.name && newDoc.commenter.email, 
      "Comments must include name and email.");
    if (newDoc.commenter.url) {      
      v.assert(newDoc.commenter.url.match(/^https?:\/\/[^.]*\..*/), 
        "Commenter URL must start with http://.");      
    }
  }
}
