function Blog(app) {
  
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
};
