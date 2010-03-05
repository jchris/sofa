function() {
  var app = $$(this).app;
  var self = $(this);
  $("pre", self).each(function() {
    var pre = $(this);
    var js = pre.text();
    var r = js.match(/\$\(\"\#([^\"]*)\"\)/);
    if (r) {
      var id = r[1];
      var code_id = 'code-'+id;
      pre.wrap('<div id="'+code_id+'"></div>');
      $('#'+code_id).evently(app.ddoc.vendor.couchapp.evently.docs.topic.edit, app, [id]);
    }
  });
};
