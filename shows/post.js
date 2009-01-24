function(doc, req) {  
  // !json lib.templates
  // !code lib.helpers.template
  
  // we only show html
  return template(lib.templates.post, {
    title : doc.title,
    post : doc.html,
    date : doc.created_at,
    author : doc.author,
    attachments : ['',req.path[0], '_design', req.path[2]].join('/')
  });
}