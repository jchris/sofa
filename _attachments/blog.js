B = new (function() {
  var converter = new Showdown.converter();

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
  		day_diff < 7 && day_diff + " days ago" ||
  		day_diff < 31 && Math.ceil( day_diff / 7 ) + " weeks ago" ||
  		day_diff < 730 && Math.ceil( day_diff / 31 ) + " months ago" ||
  		Math.ceil( day_diff / 365 ) + " years ago";
  };
  
  function stripScripts(s) {
    return s && s.replace(/<script(.|\n)*?>/g, '');
  };
  
  function safe(s) {
    return s && s.replace(/<(.|\n)*?>/g, '');
  };
  
  function author(author) {
    if (!author) return '';
    if (!author.url) return '<p class="author">by ' + author.name + '</p>';      
    return '<p class="author">by <a href="'+author.url+'">' 
      + author.name + '</a></p>';      
  };  
  
  function formatBody(post) {
    if (post.format && post.format == 'markdown') {
      return converter.makeHtml(post.body);      
    } else {
      return stripScripts(post.body);
    }
  };
  
  function dateLink(date) {
    return '<span class="date">'
    + prettyDate(date)
    +'</span>';
  };
  
  this.renderPost = function(post) {
    return '<li><h3><a href="post.html#'+post._id+'">'
    + safe(post.title) 
    + '</a></h3>'
    + dateLink(post.created_at)
    + '<div class="body">'
    + formatBody(post)
    + '</div>'
    + '</li>';
  }
});
