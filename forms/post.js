function(doc, req) {  
  
  var pageScripts = (function() {
    $.CouchApp(function(app) {
        var docid = document.location.pathname.split('/').pop();

        function displayPostTags(post) {
          app.design.view("tags", {
            reduce: false,
            success: function(json) {
              var tags = [];
              for(var idx in json.rows) {
                tags.push(json.rows[idx].key);
              }
              $("#tags").append(tags.join(","));
            }
          })
        };

        function displayComments() {
          app.design.view("comments", {
            startkey: [docid],
            endkey: [docid, {}],
            reduce : false,
            success: function(json) {
              var ul = $("#comments ul");
              for (var i=0; i < json.rows.length; i++) {
                var c = json.rows[i].value;
                ul.append(B.commentListing(c));
              }
              $('#comments').fadeIn(2000);      
            }
          });
        };

        displayComments();

        var commentForm = app.docForm("form#new-comment", {
          fields : [
            "commenter-name", 
            "commenter-email", 
            "commenter-url", 
            "comment"
          ],
          template : {
            type : "comment",
            post_id : docid,
            format : "markdown"
          },
          beforeSave : function(doc) {
            doc.html = B.formatBody(doc.comment, doc.format);
            doc.created_at = new Date();
          },
          success : function(resp, doc) {
            $("#new-comment").html('<h2>Success! Your comment has posted.</h2>');
            $("#comments ul").append(B.commentListing(doc));
            $("#comments ul li:last").hide().fadeIn(2000);
          }
        });

        $("#preview").click(function() {
          var doc = commentForm.localDoc();
          console.log(doc)
          var html = B.formatBody(doc.comment, doc.format);
          $('#comment-preview').html(html);
        });
      });
  }).toString();
  
  log(pageScripts)
  
  var postHtml = new XMLList(doc.html.replace(/<script(.|\n)*?>/g, ''));
  
  var page = <html>
  <head>
    <title>{doc.title} : Daytime Running Lights</title>
    <link rel="stylesheet" href="../../../_design/couchdb-example-blog/screen.css" type="text/css"/>
  </head>
  <body>
    <div id="header">
      <h2><a href="index.html">Daytime Running Lights</a></h2>
    </div>
    <div id="content">
      <h1>{doc.title}</h1>
      <div id="post">{postHtml}</div>
      <div id="tags"> </div>
      <div id="comments">
        <ul> </ul>
        <!-- form to create a comment -->
        <form id="new-comment" action="post.html" method="post">
          <h3>Comment on this post</h3>
          <p><label>Name</label>
          <input type="text" name="commenter-name" value=""/></p>
          <p><label>Url <em>(optional)</em></label>
          <input type="text" name="commenter-url" value=""/></p>
          <p><label>Email <em>(for <a href="http://gravatar.com">Gravatar</a>)</em></label>
          <input type="text" name="commenter-email" value=""/></p>
          <p><label>Comment <em>(with <a href="http://warpedvisions.org/projects/markdown-cheat-sheet/">Markdown</a>)</em></label>
          <textarea name="comment" rows="8" cols="40"><span></span></textarea></p>
          <p>
            <input type="button" id="preview" value="Preview"/>
            <input type="submit" value="Save &#x2192;"/>
          </p>
        </form>
        <div id="comment-preview"></div>
      </div>
    </div>    
  </body>
  <script src="/_utils/script/json2.js"> </script>
  <script src="/_utils/script/jquery.js?1.2.6"> </script>
  <script src="/_utils/script/jquery.couch.js?0.8.0"> </script>
  <script src="/couchblog/_design/couchdb-example-blog/jquery.couchapp.js"> </script>
  <script src="/couchblog/_design/couchdb-example-blog/blog.js"> </script>  
  <script src="/couchblog/_design/couchdb-example-blog/showdown.js"> </script>
  <script type="text/javascript" charset="utf-8"><pagescripts/></script>
</html>;
  page = '<!DOCTYPE html>\n' + page.toXMLString();
  page = page.replace('<pagescripts/>', '('+pageScripts+')()');
  return {
    body: page
  };
}