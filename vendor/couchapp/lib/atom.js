// atom feed generator
// requries E4X support.

function f(n) {    // Format integers to have at least two digits.
    return n < 10 ? '0' + n : n;
}

function rfc3339(date) {
  return date.getUTCFullYear()   + '-' +
    f(date.getUTCMonth() + 1) + '-' +
    f(date.getUTCDate())      + 'T' +
    f(date.getUTCHours())     + ':' +
    f(date.getUTCMinutes())   + ':' +
    f(date.getUTCSeconds())   + 'Z';
};

exports.header = function(data) {
  var f = <feed xmlns="http://www.w3.org/2005/Atom"/>;
  f.title = data.title;
  f.id = data.feed_id;
  f.link.@href = data.feed_link;
  f.link.@rel = "self";
  f.generator = "CouchApp on CouchDB";
  f.updated = rfc3339(data.updated);
  return f.toXMLString().replace(/\<\/feed\>/,'');
};

exports.entry = function(data) {
  var entry = <entry/>;
  entry.id = data.entry_id;
  entry.title = data.title;
  entry.content = data.content;
  entry.content.@type = (data.content_type || 'html');
  entry.updated = rfc3339(data.updated);
  entry.author = <author><name>{data.author}</name></author>;
  entry.link.@href = data.alternate;
  entry.link.@rel = "alternate";
  return entry;
}
