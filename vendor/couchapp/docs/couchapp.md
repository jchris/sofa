# Docs for $.couch.app

The simplest use of CouchApp in the browser is to get access to information about the database you are running in.

    $.couch.app(function(app) {
      $("#dbinfo").evently({
        _init : {
          mustache : '<p>The db name is <strong>{{name}}</strong></p>',
          data : app.db
        }
      });
    });

Yay couchapp.

The `$.couch.app()` function also loads the current design document so that it is available for templates etc. That is how the words you are reading were loaded. This file is included in the CouchApp application library. Let's look at the design doc:

    $.couch.app(function(app) {
      $("#ddoc").evently({
        _init : {
          mustache : '<p>Click to show the full doc source:</p><pre>{{ddoc}}</pre>',
          data : {
            ddoc : JSON.stringify(app.ddoc, null, 2).slice(0,100) + '...'
          }
        },
        click : {
          mustache : '<p>The full doc source (rerun to hide):</p><pre>{{ddoc}}</pre>',
          data : {
            ddoc : JSON.stringify(app.ddoc, null, 2)
          }
        }
      });
    });

