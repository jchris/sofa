function(req, db) {
  var blog = db.open('_design/purecouchblog').blog;
  
  var feed = <feed xmlns="http://www.w3.org/2005/Atom">
    <title>{blog.title}</title>
    <link href={blog.url}/>
    <updated>2003-12-13T18:30:02Z</updated>
    <author>
      <name>{blog.author.name}</name>
    </author>
    <id>{blog.url}</id>
</feed>

  var view = db.view('purecouchblog/recent',{count:10,descending:true});
    
  for (r in view.rows) {
    var row = view.rows[r];
    var post = row.value;
    var entry = <entry/>;
    entry.id = blog.url + '/' + row.id;
    entry.title = post.title;
    entry.updated = post.date;
    entry.content = post.body;
    feed.entry += entry;    
  }
  
  return {body: feed.toXMLString()};
};