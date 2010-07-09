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
// $.couch.app(function(app) {
//    app.db.view(...)
//    ...
// });

(function($) {
  
  function Design(db, name) {
    this.doc_id = "_design/"+name;
    this.view = function(view, opts) {
      db.view(name+'/'+view, opts);
    };
    this.list = function(list, view, opts) {
      db.list(name+'/'+list, view, opts);
    };
  }

  $.couch.app = $.couch.app || function(appFun, opts) {
    opts = opts || {};
    $(function() {
      var dbname = opts.db || document.location.href.split('/')[3];
      var dname = opts.design || unescape(document.location.href).split('/')[5];
      var db = $.couch.db(dbname);
      var design = new Design(db, dname);
      
      // docForm applies CouchDB behavior to HTML forms.
      // todo make this a couch.app plugin
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
            var element = form.find("[name="+field+"]");
            if (element.attr('type') === 'checkbox') {
                var val = element.attr('checked');
            } else {
                var val = element.val();
                if (!val) return;
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
          if (opts.validate && opts.validate() == false) { return false;}
          // formToDeepJSON acts on localFormDoc by reference
          formToDeepJSON(this, opts.fields, localFormDoc);
          if (opts.beforeSave) {opts.beforeSave(localFormDoc);}
          db.saveDoc(localFormDoc, {
            success : function(resp) {
              if (opts.success) {opts.success(resp, localFormDoc);}
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
            if (frontObj && frontObj[frontName]) {
              var element = form.find("[name="+field+"]");
              if (element.attr('type') === 'checkbox') {
                element.attr('checked', frontObj[frontName]);
              } else {
                element.val(frontObj[frontName]);
              }
            }
          });
        }
        
        if (opts.id) {
          db.openDoc(opts.id, {
            attachPrevRev : opts.attachPrevRev,
            error: function() {
              if (opts.error) {opts.error.apply(opts, arguments);}
            },
            success: function(doc) {
              if (opts.load || opts.onLoad) {(opts.load || opts.onLoad)(doc);}
              localFormDoc = doc;
              docToForm(doc);
          }});
        } else if (opts.template) {
          if (opts.load || opts.onLoad) {(opts.load || opts.onLoad)(opts.template);}
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
      
      function resolveModule(names, parent, current) {
        if (names.length === 0) {
          if (typeof current != "string") {
            throw ["error","invalid_require_path",
              'Must require a JavaScript string, not: '+(typeof current)];
          }
          return [current, parent];
        }
        // we need to traverse the path
        var n = names.shift();
        if (n == '..') {
          if (!(parent && parent.parent)) {
            throw ["error", "invalid_require_path", 'Object has no parent '+JSON.stringify(current)];
          }
          return resolveModule(names, parent.parent.parent, parent.parent);
        } else if (n == '.') {
          if (!parent) {
            throw ["error", "invalid_require_path", 'Object has no parent '+JSON.stringify(current)];
          }
          return resolveModule(names, parent.parent, parent);
        }
        if (!current[n]) {
          throw ["error", "invalid_require_path", 'Object has no property "'+n+'". '+JSON.stringify(current)];
        }
        var p = current;
        current = current[n];
        current.parent = p;
        return resolveModule(names, p, current);
      }
      
      var p = document.location.pathname.split('/');
      p.shift();
      var qs = document.location.search.replace(/^\?/,'').split('&');
      var q = {};
      qs.forEach(function(param) {
        var ps = param.split('=');
        var k = decodeURIComponent(ps[0]);
        var v = decodeURIComponent(ps[1]);
        if (["startkey", "endkey", "key"].indexOf(k) != -1) {
          q[k] = JSON.parse(v);
        } else {
          q[k] = v;
        }
      });
      var mockReq = {
        path : p,
        query : q
      };
      
      var appExports = $.extend({
        db : db,
        design : design,
        view : design.view,
        list : design.list,
        docForm : docForm,
        req : mockReq
      }, $.couch.app.app);

      function handleDDoc(ddoc) {
        var moduleCache = [];
        
        function getCachedModule(name, parent) {
          var key, i, len = moduleCache.length;
          for (i=0;i<len;++i) {
            key = moduleCache[i].key;
            if (key[0] === name && key[1] === parent) {
              return moduleCache[i].module;
            }
          }
          
          return null;
        }
        
        function setCachedModule(name, parent, module) {
          moduleCache.push({ key: [name, parent], module: module });
        }
        
        if (ddoc) {
          var require = function(name, parent) {
            var cachedModule = getCachedModule(name, parent);
            if (cachedModule !== null) {
              return cachedModule;
            }
            
            var exports = {};
            var resolved = resolveModule(name.split('/'), parent, ddoc);
            var source = resolved[0]; 
            parent = resolved[1];
            var s = "var func = function (exports, require) { " + source + " };";
            try {
              eval(s);
              func.apply(ddoc, [exports, function(name) {return require(name, parent, source)}]);
            } catch(e) { 
              throw ["error","compilation_error","Module require('"+name+"') raised error "+e.toSource()]; 
            }
            
            setCachedModule(name, parent, exports);
            
            return exports;
          }
          appExports.ddoc = ddoc;
          appExports.require = require;
        }
        // todo make app-exports the this in the execution context?
        appFun.apply(appExports, [appExports]);
      }
      
    if ($.couch.app.ddocs[design.doc_id]) {
      handleDDoc($.couch.app.ddocs[design.doc_id])
    } else {
      // only open 1 connection for this ddoc 
      if ($.couch.app.ddoc_handlers[design.doc_id]) {
        // we are already fetching, just wait
        $.couch.app.ddoc_handlers[design.doc_id].push(handleDDoc);
      } else {
        $.couch.app.ddoc_handlers[design.doc_id] = [handleDDoc];
        db.openDoc(design.doc_id, {
          success : function(doc) {
            $.couch.app.ddocs[design.doc_id] = doc;
            $.couch.app.ddoc_handlers[design.doc_id].forEach(function(h) {
              h(doc);
            });
            $.couch.app.ddoc_handlers[design.doc_id] = null;
          },
          error : function() {
            $.couch.app.ddoc_handlers[design.doc_id].forEach(function(h) {
              h();
            });
            $.couch.app.ddoc_handlers[design.doc_id] = null;
          }
        });
      }
    }
      
    });
  };
  $.couch.app.ddocs = {};
  $.couch.app.ddoc_handlers = {};
  // legacy support. $.CouchApp is deprecated, please use $.couch.app
  $.CouchApp = $.couch.app;
})(jQuery);

// JavaScript 1.6 compatibility functions that are missing from IE7/IE8

if (!Array.prototype.forEach)
{
    Array.prototype.forEach = function(fun /*, thisp*/)
    {
        var len = this.length >>> 0;
        if (typeof fun != "function")
            throw new TypeError();

        var thisp = arguments[1];
        for (var i = 0; i < len; i++)
        {
            if (i in this)
                fun.call(thisp, this[i], i, this);
        }
    };
}

if (!Array.prototype.indexOf)
{
    Array.prototype.indexOf = function(elt)
    {
        var len = this.length >>> 0;

        var from = Number(arguments[1]) || 0;
        from = (from < 0)
                ? Math.ceil(from)
                : Math.floor(from);
        if (from < 0)
            from += len;

        for (; from < len; from++)
        {
            if (from in this &&
                this[from] === elt)
                return from;
        }
        return -1;
    };
}
