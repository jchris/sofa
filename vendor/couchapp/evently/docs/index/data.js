function() {
  var docs = $$(this).app.ddoc.vendor.couchapp.docs;
  var dnames = [];
  $.forIn(docs, function(d) {
    dnames.push({
      title: d,
      href : "#/topic/"+encodeURIComponent(d)
      });
  });
  return {docs:dnames};
};