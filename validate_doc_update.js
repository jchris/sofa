function (newDoc, oldDoc, userCtx, secObj) {
  var v = require("lib/validate").init(newDoc, oldDoc, userCtx, secObj);

  v.isAuthor = function() {
    return v.isAdmin() || userCtx.roles.indexOf("author") != -1;
  };

  // admins or owner can always delete
  if ((v.isAdmin() || (oldDoc && (oldDoc.author == userCtx.name))) && newDoc._deleted) return true;

  v.unchanged("type");
  v.unchanged("author");
  v.unchanged("created_at");
  
  if (newDoc.created_at) v.dateFormat("created_at");

  // docs with authors can only be saved by their author
  // admin can author anything...
  if (!v.isAdmin() && newDoc.author && newDoc.author != userCtx.name) {    
    v.unauthorized("Only "+newDoc.author+" may edit this document.");
  }
      
  if (newDoc.type == 'post') {
    if (!v.isAuthor()) {
      v.unauthorized("Only authors may edit posts.");
    }
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
