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

// jquery.couchapp.js
// This file contains the basics of the CouchApp framework.
// If all you want to do is have easy access to views and docs without
// having to load more code, use this file.

// Usage: The passed in function is called when the page is ready.
// CouchApp passes an app object to the callback, which takes care of 
// linking to the proper database, and provides access to the CouchApp 
// helpers.
// 
// $.CouchApp(function(app) {
//    app.view(...)
//    ...
// });
// 
// There are other functionality plugins in the base distribution of CouchApp:
// 
// login
// this handles the login / signup process. you can style the form with CSS.
// 
// docForm
// this manages keeping a doc in sync with an HTML form. It's up to you to draw the form for now.
// 
// paths
// this makes linking between pages simple
// note: paths is included by default
// 
// mustache?
// 
// and more.
//
// TBD how we will handle client-side vs server side code loading.


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
  
  // init is called by $.CouchApp(myAppFun) which 
  // calls myAppFun after onload and some setup.
  $.CouchApp = $.CouchApp || function(appFun) {
    $(function() {
      var dbname = document.location.href.split('/')[3];
      var dname = unescape(document.location.href).split('/')[5];
      var db = $.couch.db(dbname);
      var design = new Design(db, dname);
      

      
      // merge these exports with a global object other plugins can tap into
      
      
      var appExports = $.extend({
        // legacy
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
          $.couch.session({
            success : function(resp) {
              var userCtx = resp.userCtx;
              if (userCtx.name) {
                if (loggedIn) {loggedIn(userCtx);}
              } else if (userCtx.roles.indexOf("admin") == -1) {
                if (loggedOut) {loggedOut();}
              } else {
                alert("Admin party! Fix this in Futon.");
              }
            };
          });
        },
        db : db,
        design : design,
        view : design.view,
        go : function(url) {
          // callback for when not logged in
          $('body').append('<a href="'+url+'">go</a>');
          var absurl = $('body a:last')[0].href;
          document.location = absurl;
        }
      }, $.CouchApp.app);
            
      appFun(appExports);
    });
  };
  $.CouchApp.app = $.CouchApp.app || {};
})(jQuery);

// jquery.couchapp.paths.js is included inline as an example plugin.
// TODO this is a good one to have work in the server-side context as well

(function($) {
  $.CouchApp.app.paths = {
    show : function(funcname, docid) {
      // I wish this was shared with path.js...
      return '/'+[dbname, '_design', dname, '_show', funcname, docid].join('/');
    },
    list : function(funcname, viewname) {
      // todo this should get uriEscaped
      return '/'+[dbname, '_design', dname, '_list', funcname, viewname].join('/');
    },
    futonDoc : function(docid) {
      return "/_utils/document.html?"+dbname+"/"+docid;
    }
  }

})(jQuery);