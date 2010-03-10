$.couch.app(function(app) {
  // $('.date').prettyDate();

  $("#account").evently($.extend(true, 
    app.ddoc.vendor.couchapp.evently.account, 
    app.ddoc.evently.account), app);


  // todo browse by tags
  app.design.view("tags",{
    descending: true, 
    group: true,
    success: function(json) {
      var total = 0;
      for(var idx in json.rows) {
        total += json.rows[idx].value;
      }
      var tags = [];
      for(var idx in json.rows) {
        var percent = Math.ceil(Math.pow((json.rows[idx].value / total), 0.25) * 200);
        tags.push('<span style="font-size:'+percent+'%;">' + json.rows[idx].key + '</span>');
      }
      $("#tags-front").append(tags.join(", "));
    }
  });
});