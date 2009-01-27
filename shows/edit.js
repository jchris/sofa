function(doc, req) {  
  // !json lib.templates.edit
  // !json blog
  // !code lib.helpers.template
  // !code lib.helpers.couchapp

  // log("EDIT HELLO");
  // var docid = doc ? doc._id : null;
  // log("docid":docid);
  // we only show html
  return template(lib.templates.edit, {
    doc : doc,
    docid : toJSON((doc && doc._id) || null),
    blog : blog,
    assets : assetPath(),
    index : listPath('index/recent-posts?descending=true')
  });
}