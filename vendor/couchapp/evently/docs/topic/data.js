function(e, p) {
  var doc = $$(this).app.ddoc.vendor.couchapp.docs[p.id];
  var converter = new Showdown.converter();
  var html = converter.makeHtml(doc);
  return {
    html : html
  };
};