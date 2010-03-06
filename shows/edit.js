function(doc, req) {  
  // !json templates.edit
  // !json blog
  // !cxde vendor/couchapp/path.js
  // ! cxde vendor/couchapp/template.js

  // we only show html
  return template(templates.edit, {
    doc : doc,
    docid : toJSON((doc && doc._id) || null), 
    blog : blog,
    assets : assetPath(),
    index : listPath('index','recent-posts',{descending:true,limit:8})
  });
}