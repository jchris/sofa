function (newDoc, oldDoc, userCtx) {
  var type = (oldDoc || newDoc)['type'];
  var author = (oldDoc || newDoc)['author'];
  log(userCtx)
  function forbidden(message) {
    throw({forbidden : message});
  }
  
  function unauthorized(message) {
    throw({unauthorized : message});
  };


  // docs with authors can only be saved by their author
  if (author) {
    // dirty hack to provide userCtx.name to the client process
    if (author == '_self') userCtx.name ? forbidden('_self:' + userCtx.name) : unauthorized('Please log in.');
    
    if (userCtx.roles[0] != '_admin') {
      log("admin")
      // admin can edit anything
      if (oldDoc && oldDoc.author != newDoc.author) 
        forbidden("You may not change the author of a doc.");

      if (author != userCtx.name)
        unauthorized("Only "+author+" may edit this document.");      
    }
  }

  // general timestamps
  if (oldDoc && oldDoc.created_at != newDoc.created_at) 
    forbidden("You may not change the created_at field of a doc.");
    
  if (type == 'post') {
    // post required fields
    if (!author) forbidden("Posts must have an author.");
    if (!newDoc.html) forbidden("Posts must have html field.");
    if (!newDoc.title) forbidden("Posts must have a title.");
    if (!newDoc.created_at) forbidden("Posts must have a created_at date.");
  } else if (type == 'comment') {
    // comment required fields
    if (!newDoc.commenter || !(newDoc.commenter.name && newDoc.commenter.email))
       forbidden("Comments must include name and email.");
    if (!newDoc.html) forbidden("Comments require an html body.");
  }
}