// this code makes http://example.com into a link, 
// and also handles @name and #hashtag

// todo add [[wiki_links]]

var mustache = require("vendor/couchapp/lib/mustache");
exports.encode = function(body, person_prefix, tag_prefix) {
  body = mustache.escape(body);
  person_prefix = person_prefix || "http://twitter.com/";
  tag_prefix = tag_prefix || "http://delicious.com/tag/";
  return body.replace(/((ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?)/gi,function(a) {
    return '<a target="_blank" href="'+a+'">'+a+'</a>';
  }).replace(/\@([\w\-]+)/g,function(user,name) {
    return '<a href="'+person_prefix+encodeURIComponent(name)+'">'+user+'</a>';
  }).replace(/\#([\w\-\.]+)/g,function(word,tag) {
    return '<a href="'+tag_prefix+encodeURIComponent(tag)+'">'+word+'</a>';
  });
};
