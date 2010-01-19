// via futon.js
function Session() {

  function doLogin(username, password, callback) {
    $.couch.login({
      username : username,
      password : password,
      success : function() {
        $.futon.session.sidebar();
        callback();
      },
      error : function(code, error, reason) {
        $.futon.session.sidebar();
        callback({username : "Error logging in: "+reason});
      }
    });
  }

  function doSignup(username, password, callback, runLogin) {
    $.couch.signup({
      username : username
    }, password, {
      success : function() {
        if (runLogin) {
          doLogin(username, password, callback);            
        } else {
          callback();
        }
      },
      error : function(status, error, reason) {
        $.futon.session.sidebar();
        if (error == "conflict") {
          callback({username : "Name '"+username+"' is taken"});
        } else {
          callback({username : "Signup error:  "+reason});
        }
      }
    });
  }

  function validateUsernameAndPassword(data, callback) {
    if (!data.username || data.username.length === 0) {
      callback({username: "Please enter a username."});
      return false;
    }
    if (!data.password || data.password.length === 0) {
      callback({password: "Please enter a password."});
      return false;
    }
    return true;
  }

  function createAdmin() {
    $.showDialog("dialog/_create_admin.html", {
      submit: function(data, callback) {
        if (!validateUsernameAndPassword(data, callback)) {return;}
        $.couch.config({
          success : function() {
            callback();
            doLogin(data.username, data.password, callback);            
            doSignup(data.username, null, callback, false);
          }
        }, "admins", data.username, data.password);
      }
    });
    return false;
  }

  function login() {
    $.showDialog("dialog/_login.html", {
      submit: function(data, callback) {
        if (!validateUsernameAndPassword(data, callback)) {return;}
        doLogin(data.username, data.password, callback);
      }
    });
    return false;
  }

  function logout() {
    $.couch.logout({
      success : function(resp) {
        $.futon.session.sidebar();
      }
    });
  }

  function signup() {
    $.showDialog("dialog/_signup.html", {
      submit: function(data, callback) {
        if (!validateUsernameAndPassword(data, callback)) {return;}
        doSignup(data.username, data.password, callback, true);
      }
    });
    return false;
  }

  this.setupSidebar = function() {
    $("#userCtx .login").click(login);
    $("#userCtx .logout").click(logout);
    $("#userCtx .signup").click(signup);
    $("#userCtx .createadmin").click(createAdmin);
  };

  this.sidebar = function() {
    // get users db info?
    $("#userCtx span").hide();
    $.couch.session({
      success : function(userCtx) {
        if (userCtx.name) {
          $("#userCtx .username").text(userCtx.name).attr({href : "/_utils/document.html?"+encodeURIComponent(userCtx.info.user_db)+"/org.couchdb.user%3A"+userCtx.name});
          if (userCtx.roles.indexOf("_admin") != -1) {
            $("#userCtx .loggedinadmin").show();
          } else {
            $("#userCtx .loggedin").show();
          }
        } else if (userCtx.roles.indexOf("_admin") != -1) {
          $("#userCtx .adminparty").show();
        } else {
          $("#userCtx .loggedout").show();
        }
      }
    });
  };
}