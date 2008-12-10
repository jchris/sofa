function (newDoc, oldDoc, userCtx) {
  var type = (oldDoc || newDoc)['type'];
  var author = (oldDoc || newDoc)['author'];

  function forbidden(message) {
    throw({forbidden : message});
  }
  
  function unauthorized(message) {
    throw({unauthorized : message});
  };

  // docs with authors can only be saved by their author
  if (author) {
    // dirty hack
    if (author == '_self') forbidden('_self:' + userCtx.name);
    
    if (oldDoc && oldDoc.author != newDoc.author) 
      forbidden("You may not change the author of a doc.");
    
    if (author != userCtx.name)
      unauthorized("Only "+author+" may edit this document.");
  }

  // posts must have author, html and title
  if (type == 'post') {
    if (!author) forbidden("Posts must have an author.");
    if (!newDoc.html) forbidden("Posts must have html");
    if (!newDoc.title) forbidden("Posts must have a title");
  }

}