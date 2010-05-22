function() {
  var md5 = $$(this).app.require("vendor/couchapp/lib/md5");
  
  // TODO this can be cleaned up with docForm?
  // it still needs the workflow to edit an existing profile
  var name = $("input[name=userCtxName]",this).val();
  var newProfile = {
    rand : Math.random().toString(), 
    nickname : $("input[name=nickname]",this).val(),
    email : $("input[name=email]",this).val(),
    url : $("input[name=url]",this).val()
  }, widget = $(this);

  // setup gravatar_url
  if (md5) {
    newProfile.gravatar_url = 'http://www.gravatar.com/avatar/'+md5.hex(newProfile.email || newProfile.rand)+'.jpg?s=40&d=identicon';    
  }

  // store the user profile on the user account document
  $.couch.userDb(function(db) {
    var userDocId = "org.couchdb.user:"+name;
    db.openDoc(userDocId, {
      success : function(userDoc) {
        userDoc["couch.app.profile"] = newProfile;
        db.saveDoc(userDoc, {
          success : function() {
            newProfile.name = userDoc.name;
            $$(widget).profile = newProfile;
            widget.trigger("profileReady", [newProfile]);
          }
        });
      }
    });
  });
  return false;
}