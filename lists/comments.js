function(head, req) {
  var ddoc = this;
  var Mustache = require("lib/mustache");
  var List = require("vendor/couchapp/lib/list");
  var path = require("vendor/couchapp/lib/path").init(req);
  var Atom = require("vendor/couchapp/lib/atom");

  var indexPath = path.list('index','recent-posts',{descending:true, limit:10});
  var feedPath = path.list('index','recent-posts',{descending:true, limit:10, format:"atom"});
  var commentsFeed = path.list('comments','comments',{descending:true, limit:10, format:"atom"});

  // if the client requests an atom feed and not html, 
  // we run this function to generate the feed.
  provides("atom", function() {    
    var path = require("vendor/couchapp/lib/path").init(req);
    var markdown = require("vendor/couchapp/lib/markdown");
    var textile = require("vendor/textile/textile");

    // we load the first row to find the most recent change date
    var row = getRow();
    
    // generate the feed header
    var feedHeader = Atom.header({
      updated : (row ? new Date(row.value.created_at) : new Date()),
      title : ddoc.blog.title + " comments",
      feed_id : path.absolute(indexPath),
      feed_link : path.absolute(commentsFeed)
    });
    
    // send the header to the client
    send(feedHeader);

    // loop over all rows
    if (row) {
      do {
        var v = row.value;
        
        // generate the entry for this row
        var feedEntry = Atom.entry({
          entry_id : path.absolute('/'+encodeURIComponent(req.info.db_name)+'/'+encodeURIComponent(row.id)),
          title : "comment on "+v.post_id,
          content : markdown.encode(Mustache.escape(v.comment)),
          updated : new Date(v.created_at),
          author : v.commenter.nickname || v.commenter.name,
          alternate : path.absolute(path.list('post','post-page', {startkey:[v.post_id]}))
        });
        // send the entry to client
        send(feedEntry);
      } while (row = getRow());
    }

    // close the loop after all rows are rendered
    return "</feed>";
  });
}
