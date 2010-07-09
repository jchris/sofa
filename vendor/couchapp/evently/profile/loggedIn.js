function(e, r) {
  var userCtx = r.userCtx;
  var widget = $(this);
  // load the profile from the user doc
  var db = $.couch.db(r.info.authentication_db);
  var userDocId = "org.couchdb.user:"+userCtx.name;
  db.openDoc(userDocId, {
    success : function(userDoc) {
      var profile = userDoc["couch.app.profile"];
      if (profile) {
        // we copy the name to the profile so it can be used later
        // without publishing the entire userdoc (roles, pass, etc)
        profile.name = userDoc.name;
        $$(widget).profile = profile;
        widget.trigger("profileReady", [profile]);
      } else {
        widget.trigger("noProfile", [userCtx]);
      }
    }
  });
}
