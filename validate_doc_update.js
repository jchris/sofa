function (newDoc, oldDoc, userCtx, secObj) {
  var v = require("lib/validate").init(newDoc, oldDoc, userCtx, secObj);

  v.unchanged("type");
  v.unchanged("author");
  v.unchanged("created_at");
  
  if (newDoc.created_at) v.dateFormat("created_at");

  // docs with authors can only be saved by their author
  // admin can author anything...
  if (!v.isAdmin(userCtx) && newDoc.author && newDoc.author != userCtx.name) {    
    v.unauthorized("Only "+newDoc.author+" may edit this document.");
  }

  // admins can always delete
  if (v.isAdmin(userCtx) && newDoc._deleted) return true;
    
  if (newDoc.type == 'post') {
    v.require("created_at", "author", "body", "format", "title");

  } else if (newDoc.type == 'comment') {
    v.require("created_at", "post_id", "comment", "format", "commenter");
    v.assert(newDoc.commenter.name && newDoc.commenter.email, 
      "Comments must include name and email.");
    if (newDoc.commenter.url) {
      v.assert(newDoc.commenter.url.match(/^https?:\/\/[^.]*\..*/), 
        "Commenter URL must start with http://.");      
    }
  }
}
