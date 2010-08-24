// a library for validations
// over time we expect to extract more helpers and move them here.
exports.init = function(newDoc, oldDoc, userCtx, secObj) {
  var v = {};
  
  v.forbidden = function(message) {    
    throw({forbidden : message});
  };

  v.unauthorized = function(message) {
    throw({unauthorized : message});
  };

  v.assert = function(should, message) {
    if (!should) v.forbidden(message);
  }
  
  v.isAdmin = function() {
    return userCtx.roles.indexOf('_admin') != -1
  };
  
  v.isRole = function(role) {
    return userCtx.roles.indexOf(role) != -1
  };

  v.require = function() {
    for (var i=0; i < arguments.length; i++) {
      var field = arguments[i];
      message = "The '"+field+"' field is required.";
      if (typeof newDoc[field] == "undefined") v.forbidden(message);
    };
  };

  v.unchanged = function(field) {
    if (oldDoc && oldDoc[field] != newDoc[field]) 
      v.forbidden("You may not change the '"+field+"' field.");
  };

  v.matches = function(field, regex, message) {
    if (!newDoc[field].match(regex)) {
      message = message || "Format of '"+field+"' field is invalid.";
      v.forbidden(message);    
    }
  };

  // this ensures that the date will be UTC, parseable, and collate correctly
  v.dateFormat = function(field) {
    message = "Sorry, '"+field+"' is not a valid date format. Try: 2010-02-24T17:00:03.432Z";
    v.matches(field, /\d{4}\-\d{2}\-\d{2}T\d{2}:\d{2}:\d{2}(\.\d*)?Z/, message);
  }
  
  return v;
};
