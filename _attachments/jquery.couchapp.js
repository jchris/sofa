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

// Usage:
// $.CouchApp

// Monkeypatching Date. 


(function($) {

  function f(n) {    // Format integers to have at least two digits.
      return n < 10 ? '0' + n : n;
  }

  Date.prototype.toJSON = function() {
      return this.getUTCFullYear()   + '/' +
           f(this.getUTCMonth() + 1) + '/' +
           f(this.getUTCDate())      + ' ' +
           f(this.getUTCHours())     + ':' +
           f(this.getUTCMinutes())   + ':' +
           f(this.getUTCSeconds())   + ' +0000';
  };
  
  function Design(db, name) {
    this.view = function(view, opts) {
      db.view(name+'/'+view, opts);
    };
  };

  var login;
  
  function init(app) {
    $(function() {
      var dbname = document.location.href.split('/')[3];
      var dname = unescape(document.location.href).split('/')[5];
      var db = $.couch.db(dbname);
      var design = new Design(db, dname);
      
      app({
        formPath : function(form, docid) {
          return '/'+[dbname, '_form', dname, form, docid].join('/')
        },
        attemptLogin : function(win, fail) {
          // depends on nasty hack in blog validation function
          db.saveDoc({"author":"_self"}, { error: function(s, e, r) {
            var namep = r.split(':');
            if (namep[0] == '_self') {
              login = namep.pop();
              $.cookies.set("login", login, '/'+dbname)
              win && win(login);
            } else {
              $.cookies.set("login", "", '/'+dbname)
              fail && fail(s, e, r);
            }
          }});        
        },
        loggedInNow : function(loggedIn, loggedOut) {
          login = login || $.cookies.get("login");
          if (login) {
            loggedIn && loggedIn(login);
          } else {
            loggedOut && loggedOut();
          }
        },
        db : db,
        design : design,
        docForm : function(formSelector, opts) {
          var localFormDoc = {};
          opts = opts || {};
          opts.fields = opts.fields || [];
          
          // turn the form into deep json
          // field names like 'author-email' get turned into json like
          // {"author":{"email":"quentin@example.com"}}
          function formToDeepJSON(form, fields, doc) {
            var form = $(form);
            opts.fields.forEach(function(field) {
              var val = form.find("[name="+field+"]").val()
              if (!val) return;
              var parts = field.split('-');
              var frontObj = doc, frontName = parts.shift();
              while (parts.length > 0) {
                frontObj[frontName] = frontObj[frontName] || {}
                frontObj = frontObj[frontName];
                frontName = parts.shift();
              }
              frontObj[frontName] = val;
            });
          };
          
          // Apply the behavior
          $(formSelector).submit(function(e) {
            e.preventDefault();
            // formToDeepJSON acts on localFormDoc by reference
            formToDeepJSON(this, opts.fields, localFormDoc);
            if (opts.beforeSave) opts.beforeSave(localFormDoc);
            db.saveDoc(localFormDoc, {
              success : function(resp) {
                if (opts.success) opts.success(resp, localFormDoc);
              }
            })
            
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
              if (frontObj && frontObj[frontName])
                form.find("[name="+field+"]").val(frontObj[frontName]);
            });            
          };
          
          if (opts.id) {
            db.openDoc(opts.id, {
              success: function(doc) {
                if (opts.onLoad) opts.onLoad(doc);
                localFormDoc = doc;
                docToForm(doc);
            }});
          } else if (opts.template) {
            if (opts.onLoad) opts.onLoad(opts.template);
            localFormDoc = opts.template;
            docToForm(localFormDoc);
          }
          var instance = {
            deleteDoc : function(opts) {
              opts = opts || {};
              if (confirm("Really delete this post?")) {                
                db.removeDoc(localFormDoc, opts);
              }
            },
            localDoc : function() {
              formToDeepJSON(formSelector, opts.fields, localFormDoc);
              return localFormDoc;
            }
          }
          return instance;
        }
      });
    });
  };
  
  $.CouchApp = $.CouchApp || init;
  
  // $.fn.extend($.CouchApp,{
  //   foo : function() {
  //     return "bar";
  //   }
  // });
})(jQuery);

// function patchTest(fun) {
//   var source = fun.toString();
//   var output = "";
//   var i = 0;
//   var testMarker = "T("
//   while (i < source.length) {
//     var testStart = source.indexOf(testMarker, i);
//     if (testStart == -1) {
//       output = output + source.substring(i, source.length);
//       break;
//     }
//     var testEnd = source.indexOf(");", testStart);
//     var testCode = source.substring(testStart + testMarker.length, testEnd);
//     output += source.substring(i, testStart) + "T(" + testCode + "," + JSON.stringify(testCode);
//     i = testEnd;
//   }
//   try {
//     return eval("(" + output + ")");
//   } catch (e) {
//     return null;
//   }
// }
// 
// // assert
// function T(arg1, arg2) {
//   if (!arg1) {
//     console.log("Assertion failed: "+(arg2 != null ? arg2 : arg1).toString());
//   }
// }
// 
// // tests
// 
// patchTest(function() {
//   T($.CouchApp.foo() == 'bar');
//   $.CouchApp(function(app) {
//     // T(false, "PASS: the callback should be executed");
//     T(app.db);
//     T(app.design);
//     T(app.design.view);
//   });
// })();

