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
// $.couchapp

(function($) {
  
  function Design(db, name) {
    this.view = function(view, opts) {
      db.view(name+'/'+view, opts);
    };
  };
  
  function init(callback) {
    $(function() {
      var dbname = document.location.href.split('/')[3];
      var dname = unescape(document.location.href).split('/')[5];
      var db = $.couch.db(dbname);
      var design = new Design(db, dname);
      
      callback({
        db : db,
        design : design,
        docForm : function(formSelector, opts) {
          var localFormDoc = {};
          opts = opts || {};
          opts.fields = opts.fields || [];
          $(formSelector).submit(function(e) {
            e.preventDefault();
            var form = $(this);
            opts.fields.forEach(function(field) {
              var val = form.find("[name="+field+"]").val()
              if (val) localFormDoc[field] = val;
            });
            if (opts.beforeSave) opts.beforeSave(localFormDoc);
            console.log("save");
            console.log(localFormDoc);
            return false;
          });
          if (opts.id) {
            db.openDoc(opts.id, {
              success: function(doc) {
                if (opts.onLoad) opts.onLoad(doc);
                localFormDoc = doc;
                var form = $(formSelector);
                for (field in doc) { // todo $.each
                  form.find("[name="+field+"]").val(doc[field]);
                  // add hidden fields for any others?
                }
            }});
          }
        }
      });
    });
  };
  
  $.couchapp = $.couchapp || init;
  
  $.fn.extend($.couchapp,{
    foo : function() {
      return "bar";
    }
  });
})(jQuery);

function patchTest(fun) {
  var source = fun.toString();
  var output = "";
  var i = 0;
  var testMarker = "T("
  while (i < source.length) {
    var testStart = source.indexOf(testMarker, i);
    if (testStart == -1) {
      output = output + source.substring(i, source.length);
      break;
    }
    var testEnd = source.indexOf(");", testStart);
    var testCode = source.substring(testStart + testMarker.length, testEnd);
    output += source.substring(i, testStart) + "T(" + testCode + "," + JSON.stringify(testCode);
    i = testEnd;
  }
  try {
    return eval("(" + output + ")");
  } catch (e) {
    return null;
  }
}

// assert
function T(arg1, arg2) {
  if (!arg1) {
    console.log("Assertion failed: "+(arg2 != null ? arg2 : arg1).toString());
  }
}

// tests

patchTest(function() {
  T($.couchapp.foo() == 'bar');
  $.couchapp(function(app) {
    // T(false, "PASS: the callback should be executed");
    T(app.db);
    T(app.design);
    T(app.design.view);
  });
})();

