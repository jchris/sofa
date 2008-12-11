B = new (function() {
  // var converter = new Showdown.converter();

  function prettyDate(time){
  	var date = new Date(time),
  		diff = (((new Date()).getTime() - date.getTime()) / 1000),
  		day_diff = Math.floor(diff / 86400);

    // if ( isNaN(day_diff) || day_diff < 0 || day_diff >= 31 ) return;

  	return day_diff < 1 && (
  			diff < 60 && "just now" ||
  			diff < 120 && "1 minute ago" ||
  			diff < 3600 && Math.floor( diff / 60 ) + " minutes ago" ||
  			diff < 7200 && "1 hour ago" ||
  			diff < 86400 && Math.floor( diff / 3600 ) + " hours ago") ||
  		day_diff == 1 && "yesterday" ||
  		day_diff < 21 && day_diff + " days ago" ||
  		day_diff < 45 && Math.ceil( day_diff / 7 ) + " weeks ago" ||
  		day_diff < 730 && Math.ceil( day_diff / 31 ) + " months ago" ||
  		Math.ceil( day_diff / 365 ) + " years ago";
  };
  
  function stripScripts(s) {
    return s && s.replace(/<script(.|\n)*?>/g, '');
  };
  
  function safe(s,cap) {
    if (cap && cap < s.length) {
      s = s.substring(0,cap);
      s += '...';
    }
    return s && s.replace(/<(.|\n)*?>/g, '');
  };
  
  function author(author) {
    if (!author) return '';
    if (!author.url) return '<span class="author">by ' + safe(author.name) + '</span>';
    return '<span class="author">by <a href="'+author.url+'">' 
      + safe(author.name) + '</a></span>';      
  };  

  
  function niceDate(date) {
    return '<span class="date">'
    + prettyDate(date)
    +'</span>';
  };
  
  this.postToEntry = function(post, id) {
    return '<li><h3><a href="post.html#'+id+'">'
    + safe(post.title) 
    + '</a></h3>'
    + niceDate(post.created_at)
    + '<div class="body">'
    + post.summary
    + '</div>'
    + '</li>';
  }
  
  this.postToHTML = function(post) {
    return niceDate(post.created_at)
    + '<div class="body">'
    + stripScripts(post.html)
    + '</div>';
  };
  
  this.commentListing = function(c) {
    return '<li><h4>'
    + author(c.commenter) + ', '
    + prettyDate(c.created_at)
    + '</h4>'
    + '<img class="gravatar" src="http://www.gravatar.com/avatar/'+c.commenter.gravatar+'.jpg?s=40&d=identicon"/>'
    +'<p>'+ stripScripts(c.html)
    + '</p>'
    + '</li>';
  };
  
  this.formatBody = function(body, format) {
    if (format == 'markdown') {
      var converter = new Showdown.converter();
      return converter.makeHtml(body);
    } else if (format == 'textile') {
      return superTextile(body);
    } else {
      return body;
    }
  }
});
