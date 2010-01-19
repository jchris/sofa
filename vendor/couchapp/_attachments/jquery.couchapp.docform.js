(function($) {

  // turn the form into deep json
  // field names like 'author-email' get turned into json like
  // {"author":{"email":"quentin@example.com"}}
  // can we use jqery.form.js for some of this?
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

  // docForm applies CouchDB behavior to HTML forms.
  $.CouchApp.app.docForm = function(formSelector, opts) {
      var localFormDoc = {};
      opts = opts || {};
      opts.fields = opts.fields || [];
      
      // Apply the behavior
      $(formSelector).submit(function(e) {
        // e.preventDefault();
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
      // apply callbacks and set the localFormDoc
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
    };
  };
 
 })(jQuery);
