// !code helpers/md5.js

exports.withGravatar = function(doc) {
  if (doc.commenter && doc.commenter.email && !doc.commenter.gravatar_url) {
    var hashed = hex_md5(doc.commenter.email);
    var k, newDoc = {};
    for (k in doc) {
      if (doc.hasOwnProperty(k)) {
        newDoc[k] = doc[k];
      }
    }
    newDoc.commenter = {};
    for (k in doc.commenter) {
      if (doc.commenter.hasOwnProperty(k)) {
        newDoc.commenter[k] = doc.commenter[k];
      }
    }
    newDoc.commenter.gravatar_url = 'http://www.gravatar.com/avatar/'+hashed+'.jpg?s=40&d=identicon';
    return newDoc;
  } else {
    return doc;
  }
};
