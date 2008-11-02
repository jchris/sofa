B = new (function() {
  this.author = function(post) {
    if (!post.author) 
      return '';
    if (!post.author_url) 
      return '<p class="author">-- ' + post.author + '</em>';      
    return '<p class="author">-- <a href="'+post.author_url+'">' + 
      post.author + '</a></em>';      
  };  
  this.safe = function(s) {
    return s && s.replace(/<(.|\n)*?>/g, '');
  }
});
