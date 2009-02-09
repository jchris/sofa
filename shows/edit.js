function(doc, req) {  
  // !json lib.templates.edit
  // !json blog
  // !code lib.helpers.template
  // !code lib.helpers.couchapp

  // we only show html
  return template(lib.templates.edit, {
    doc : doc,
    // couch trunk newer than r738295 required for toJSON()
    docid : toJSON((doc && doc._id) || null), 
    blog : blog,
    assets : assetPath(),
    index : listPath('index','recent-posts',{descending:true,limit:8})
  });
}