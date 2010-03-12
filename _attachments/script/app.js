$.couch.app(function(app) {
  $('.date').prettyDate();

  $("#account").evently($.extend(true, 
    app.ddoc.vendor.couchapp.evently.account, 
    app.ddoc.evently.account), app);
});