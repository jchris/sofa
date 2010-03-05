$.log = function() {
  // console.log(arguments)
};

$.couch.app(function(app) {
  $("#docs").evently(app.ddoc.vendor.couchapp.evently.docs, app);
  $.pathbinder.begin("/");
});