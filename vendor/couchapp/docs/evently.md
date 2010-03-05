# Evently Docs

Evently is an declarative framework for evented jQuery applications. You write your code as widgets made up of templates and callbacks, while Evently handles the busywork of linking them together.

Evently has special handlers for CouchDB views and `_changes` feeds, and could be easily extended for other server-side frameworks.

## Hello World

At it's simplest an Evently widget is a set of events connected to a single DOM element.

JavaScript:

    $("#hello").evently({
      _init : {
        mustache : "<p>Hello world</p>",
      },
      click : {
        mustache : "<p>What a crazy world!</p>",        
      }
    });

You can also do some more interesting things:

    $("#heyjane").evently({
      _init : {
        mustache : '<p>Hello <a href="#jane">Jane</a>, <a href="#joan">Joan</a> (pick one)</p>',
        selectors : {
          'a[href=#joan]' : {
            click : 'hiJoan'
          },
          'a[href=#jane]' : {
            click : 'hiJane'
          }
        }
      },
      hiJoan : {
        mustache : '<p>Hello Joan!</p>'
      },
      hiJane : {
        mustache : "<p>Darn, it's Jane...</p>",
        after : function() {
          setTimeout(function() {
            // automatically trigger the "janeRocks" event after 2 seconds.
            $("#heyjane").trigger("janeRocks");
          }, 2000);
        }
      },
      janeRocks : {
        render : "append",
        mustache : "<p>Actually Jane is awesome.</p>"
      }
    });


The imporant thing about this is that the widget is defined by an JavaScript object. This means we can save it as files on our hard drive and `couchapp` will handle saving it as a JSON object for us.

[screenshot of the above code in textmate's file drawer]

When we let CouchApp package our evently apps we get to work on them in individual files, instead of as a great big giant mess of JavaScript. This means HTML is HTML, JSON is JSON, and JavaScript is JavaScript. Yay!

## Ajax Hello World

Let's do a little Ajax. We'll just load the version of the CouchDB instance we happen to be serving our HTML from:

    $("#ajax").evently({
      _init : {
        mustache : '<p>Loading CouchDB server info.</p>',
        after : function() {
          var widget = $(this);
          $.ajax({
            url : '/',
            complete : function(req) {
              var resp = $.httpData(req, "json");
              widget.trigger("version", [resp]);
            }
          })
        }
      },
      version : {
        mustache : "<p>Running CouchDB version {{version}}</p>",
        data : function(e, resp) {
          return resp;
        }
      }
    });

Explain `mustache` and `data`

-- triggering other events
  -- selectors
  -- create a doc

## Evently and CouchApp together

Evently makes it easy to write decoupled JavaScript code, but as the examples above show, Evently widgets can turn into a lot of JSON to look at all on one screen. Because Evently code is declarative, and each handler and callback stands on its own (instead of being wrapped in a common closure), it can be broken out into individual files.

CouchApp provides a mechanism for mapping between individual files and JSON structures. In this model a directory structure is mapped to a JSON object. So if you have a directory structure like:

    _init/
      mustache.html
      selectors/
        form/
          submit.js
        input.name/
          change.js
        a.cancel/
          click.txt
    cancelled/
      mustache.html
      selectors/
        a.continue/
          click.txt

It will appear within your CouchApp design document as:

    {
      _init : {
        mustache : "contents of mustache.html",
        selectors {
          form : {
            submit : "function() { ... }"
          },
          "input.name" {
            change : "function() { ... }"
          },
          "a.cancel" {
            click : "cancelled"
          }
        }
      },
      cancelled : {
        mustache : "contents of mustache.html",
        selectors : {
          "a.continue" : {
            click : "_init"
          }
        }
      }
    }

This makes Evently and CouchApp a natural fit for each other. I swear I didn't plan this when I started writing Evently, it just turned out to be an awesome side effect of trying to stay as close to JSON as possible.

In the [account widget tutorial](#/topic/account) we see the details of the account widget. What isn't discussed much there, is how the code is edited on your filesystem.

If you are writing an Evently CouchApp widget you can edit the individual pieces on your filesystem. This has the added advantage of giving you native syntax highlighting for all the code. Instead of editing everything as JSON or JavaScript, the templates can be treated as HTML, the paths as text, etc.

## Evently Queries

Evently understands CouchDB in a couple of very simple ways. If you know CouchDB, you're probably familiar with its Map Reduce views. Evently lets you specify view queries in a declarative way, and even takes care of the Ajax request. All you have to do is write code to handle the returned data.

-- new rows, etc

-- run a query

-- connect to changes

-- links to example apps

A tour of Taskr