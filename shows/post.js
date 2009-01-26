function(doc, req) {  
  // !json lib.templates.post
  // !json blog
  // !code lib.helpers.template
  // !code lib.helpers.couchapp

  // we only show html
  return template(lib.templates.post, {
    title : doc.title,
    blogName : blog.title,
    post : doc.html,
    date : doc.created_at,
    author : doc.author,
    assets : assetPath(),
    index : listPath('index/recent-posts')
  });
}