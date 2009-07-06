function forbidden(message) {    
  throw({forbidden : message});
};

function unauthorized(message) {
  throw({unauthorized : message});
};

function require(beTrue, message) {
  if (!beTrue) forbidden(message);
};

function isAdmin(userCtx) {
  userCtx.roles.indexOf('_admin') != -1
};