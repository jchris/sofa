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

// turn the form into deep json
// field names like 'author-email' get turned into json like
// {"author":{"email":"quentin@example.com"}}
// acts on doc by reference, so you can safely pass non-form fields through
function formToDeepJSON(form, fields, doc) {
  form = $(form);
  fields.forEach(function(field) {
    var val = form.find("[name="+field+"]").val();
    if (!val) {return;}
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

function onSubmit(form, db, doc, opts) {
  formToDeepJSON(form, opts.fields, doc);
  if (opts.beforeSave) {opts.beforeSave(doc);}
  db.saveDoc(localFormDoc, {
    success : function(resp) {
      if (opts.success) {opts.success(resp, doc);}
    }
  });
};

function applyFields(form, doc) {
  
};
exports.applyFields = applyFields;

// docForm applies CouchDB behavior to HTML forms.
// todo make this a couch.app plugin
function docForm(formSelector, opts) {
  var localFormDoc = {};
  opts = opts || {};
  opts.fields = opts.fields || [];

  // Apply the behavior
  $(formSelector).submit(function(e) {


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
        form.find("[name="+field+"]").val(frontObj[frontName]);              
      }
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




