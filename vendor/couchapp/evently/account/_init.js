function() {
  var elem = $(this);
  $.couch.session({
    success : function(r) {
      var userCtx = r.userCtx;
      if (userCtx.name) {
        elem.trigger("loggedIn", [r]);
      } else if (userCtx.roles.indexOf("_admin") != -1) {
        elem.trigger("adminParty");
      } else {
        elem.trigger("loggedOut");
      };
    }
  });
}