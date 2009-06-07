function(doc) {
  // only posts have slugs, dates, and html
  if (doc.type == "post") {
    // strip out tags for the summary
    var summary = (doc.html.replace(/<(.|\n)*?>/g, '');
    
    // we only want a 350 char preview.
    if(summary.length > 350) {
      summary = summary.substring(0,350)) + "…";
    }
    
    // link twitter names
    // todo: make/use a library function
    summary = summary.replace(/ @([^ .,]+)/g, ' <a href="http://twitter.com/$1">@$1</a>');
    emit(doc.created_at, {
      html : doc.html,
      summary : summary,
      title : doc.title,
      author : doc.author,
      created_at : doc.created_at
    });    
  }
};