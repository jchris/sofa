// Licensed under the Apache License, Version 2.0 (the "License"); you may not
// use this file except in compliance with the License.  You may obtain a copy
// of the License at
//
//   http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
// WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.  See the
// License for the specific language governing permissions and limitations under
// the License.

// Usage: The passed in function is called when the page is ready.
// CouchApp passes in the app object, which takes care of linking to 
// the proper database, and provides access to the CouchApp helpers.
// $.CouchApp(function(app) {
//    app.db.view(...)
//    ...
// });

(function($) {

  // extra special sure that we use json2.js style dates.

  function f(n) {
      // Format integers to have at least two digits.
      return n < 10 ? '0' + n : n;
  }

  if (typeof Date.prototype.toJSON !== 'function') {

      Date.prototype.toJSON = function (key) {

          return isFinite(this.valueOf()) ?
                 this.getUTCFullYear()   + '-' +
               f(this.getUTCMonth() + 1) + '-' +
               f(this.getUTCDate())      + 'T' +
               f(this.getUTCHours())     + ':' +
               f(this.getUTCMinutes())   + ':' +
               f(this.getUTCSeconds())   + 'Z' : null;
      };

      String.prototype.toJSON =
      Number.prototype.toJSON =
      Boolean.prototype.toJSON = function (key) {
          return this.valueOf();
      };
  }
  
  function Design(db, name) {
    this.view = function(view, opts) {
      db.view(name+'/'+view, opts);
    };
  }

  var login;
  
  function init(appFun) {
    $(function() {
      var dbname = document.location.href.split('/')[3];
      var dname = unescape(document.location.href).split('/')[5];
      var db = $.couch.db(dbname);
      var design = new Design(db, dname);
      
      function loginForm() {
        
      };
      
      // docForm applies CouchDB behavior to HTML forms.
      function docForm(formSelector, opts) {
        var localFormDoc = {};
        opts = opts || {};
        opts.fields = opts.fields || [];
        
        // turn the form into deep json
        // field names like 'author-email' get turned into json like
        // {"author":{"email":"quentin@example.com"}}
        function formToDeepJSON(form, fields, doc) {
          form = $(form);
          opts.fields.forEach(function(field) {
            var val = form.find("[name="+field+"]").val();
            if (!val) {
              return;
              }
            var parts = field.split('-');
            var frontObj = doc, frontName = parts.shift();
            while (parts.length > 0) {
              frontObj[frontName] = frontObj[frontName] || {};
              frontObj = frontObj[frontName];
              frontName = parts.shift();
            }
            frontObj[frontName] = val;
          });
        }
        
        // Apply the behavior
        $(formSelector).submit(function(e) {
          e.preventDefault();
          // formToDeepJSON acts on localFormDoc by reference
          formToDeepJSON(this, opts.fields, localFormDoc);
          if (opts.beforeSave) {opts.beforeSave(localFormDoc);}
          db.saveDoc(localFormDoc, {
            success : function(resp) {
              if (opts.success) {
                opts.success(resp, localFormDoc);
              }
            }
          });
          
          return false;
        });

        // populate form from an existing doc
        function docToForm(doc) {
          var form = $(formSelector);
          // fills in forms
          opts.fields.forEach(function(field) {
            var parts = field.split('-');
            var run = true, frontObj = doc, frontName = parts.shift();
            while (frontObj && parts.length > 0) {                
              frontObj = frontObj[frontName];
              frontName = parts.shift();
            }
            if (frontObj && frontObj[frontName]){
              form.find("[name="+field+"]").val(frontObj[frontName]);}
          });            
        }
        
        if (opts.id) {
          db.openDoc(opts.id, {
            success: function(doc) {
              if (opts.onLoad) {opts.onLoad(doc);}
              localFormDoc = doc;
              docToForm(doc);
          }});
        } else if (opts.template) {
          if (opts.onLoad) {opts.onLoad(opts.template);}
          localFormDoc = opts.template;
          docToForm(localFormDoc);
        }
        var instance = {
          deleteDoc : function(opts) {
            opts = opts || {};
            if (confirm("Really delete this document?")) {                
              db.removeDoc(localFormDoc, opts);
            }
          },
          localDoc : function() {
            formToDeepJSON(formSelector, opts.fields, localFormDoc);
            return localFormDoc;
          }
        };
        return instance;
      }

      // this should be in it's own library
      function prettyDate(time) {
      	var date = new Date(time),
      		diff = (((new Date()).getTime() - date.getTime()) / 1000),
      		day_diff = Math.floor(diff / 86400);

      	return day_diff < 1 && (
      			diff < 60 && "just now" ||
      			diff < 120 && "1 minute ago" ||
      			diff < 3600 && Math.floor( diff / 60 ) + " minutes ago" ||
      			diff < 7200 && "1 hour ago" ||
      			diff < 86400 && Math.floor( diff / 3600 ) + " hours ago") ||
      		day_diff == 1 && "yesterday" ||
      		day_diff < 21 && day_diff + " days ago" ||
      		day_diff < 45 && Math.ceil( day_diff / 7 ) + " weeks ago" ||
      		day_diff < 730 && Math.ceil( day_diff / 31 ) + " months ago" ||
      		Math.ceil( day_diff / 365 ) + " years ago";
      }
      
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
      
      var exports = {
        showPath : function(funcname, docid) {
          // I wish this was shared with path.js...
          return '/'+[dbname, '_design', dname, '_show', funcname, docid].join('/');
        },
        listPath : function(funcname, viewname) {
          return '/'+[dbname, '_design', dname, '_list', funcname, viewname].join('/');
        },
        futonDocPath : function(docid) {
          return "/_utils/document.html?"+dbname+"/"+docid;
        },
        slugifyString : function(string) {
          return string.replace(/\W/g,'-').
            replace(/\-*$/,'').replace(/^\-*/,'').
            replace(/\-{2,}/,'-');
        },
        attemptLogin : function(win, fail) {
          var self = this;
          $.ajax({
            url: "/_session",
            dataType: "json",
            // we can remove the local cookie stuff
            success:function(data) {
              login = data.name;
              if (login) {
                $.cookies.set("login", login, '/'+dbname);
                if (win) { win(login); }
              } else {
                $.cookies.set("login", "", '/'+dbname);
                if (fail) { fail(); }
              }
            },
            error: function() {
              $.cookies.set("login", "", '/'+dbname);
              if (fail) { fail(); }
            }
          });      
        },
        loggedInNow : function(loggedIn, loggedOut) {
          login = login || $.cookies.get("login");
          if (login) {
            if (loggedIn) {loggedIn(login);}
          } else {
            if (loggedOut) {loggedOut();}
          }
        },
        db : db,
        design : design,
        view : design.view,
        docForm : docForm,
        prettyDate : prettyDate,
        page : {
          prettyDates : function() {
            $('.date').each(function() {
              $(this).text(prettyDate(this.innerHTML));
            });
          }
        },
        go : function(url) {
          // callback for when not logged in
          $('body').append('<a href="'+url+'">go</a>');
          var absurl = $('body a:last')[0].href;
          document.location = absurl;
        }
      };
      appFun(exports);
    });
  };
  $.CouchApp = $.CouchApp || init;

})(jQuery);
