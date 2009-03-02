function(doc, req) {  
  // !json templates.edit
  // !json blog
  // !code vendor/couchapp/path.js
  // !code vendor/couchapp/template.js

  // we only show html
  return template(templates.edit, {
    doc : doc,
    // couch trunk newer than r738295 required for toJSON()
    docid : toJSON((doc && doc._id) || null), 
    blog : blog,
    assets : assetPath(),
    index : listPath('index','recent-posts',{descending:true,limit:8})
  });
}