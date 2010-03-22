exports.permanent = function(redirect) {
  return {
    code : 301,
    headers : {
      "Location" : redirect
    }
  };
};