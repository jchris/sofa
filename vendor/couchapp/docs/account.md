# Docs for the account widget

You should use this widget in any CouchApp that allows users to login or signup.

It is easy to install. To use the account widget, just define a `div` in your page and use [CouchApp](#/topic/couchapp) to load it from the design document and [Evently](#/topic/evently) to apply it to the page.

Here's the most basic usage:

    $.couch.app(function(app){
      $("#basic_account").evently(app.ddoc.vendor.couchapp.evently.account);      
    });

Run this example and try signing up, and logging in and out. This code is part of the CouchApp standard library, so feel free to use it in your applications. It is also "trivial" to replace and extend the functionality. In a minutes, we'll start by replacing a template, and then show how you can use Evently to connect multiple widgets, to build more complex applications.

## A widget is a collection of event handlers

First lets look more closely at the account widget (click Run to see the code we're about to discuss, it will appear in the sidebar -- the example code below is just used for loading and displaying the account widget source code).

    $.couch.app(function(app){
      $("#account_widget_code").evently({
        _init : {
          mustache : "<pre>{{json}}</pre>",
          data : function() {
            var widget = app.ddoc.vendor.couchapp.evently.account;
            return {
              json : JSON.stringify(widget, null, 2)
            }
          }
        }
      });      
    });

The top level keys are the most important: `loggedIn`, `loggedOut`, `adminParty`, `signupForm`, `loginForm`, `doLogin`, `doSignup`, and `_init`. Each one of these corresponds to an event or state the system can be in. Some of them draw user interface elements, other directly trigger further events. 

### _init

The `_init` event is special, in that Evently will automatically trigger it when the widget is created. Here is the code for the account widget's `_init` event handler.

    function() {
      var elem = $(this);
      $.couch.session({
        success : function(r) {
          var userCtx = r.userCtx;
          if (userCtx.name) {
            elem.trigger("loggedIn", [r]);
          } else if (userCtx.roles.indexOf("_admin") != -1) {
            elem.trigger("adminParty");
          } else {
            elem.trigger("loggedOut");
          };
        }
      });
    }

This code does one query to CouchDB, to retrieve the session information for the current user. For this we use the `$.couch.session()` function which is part of the [jquery.couch.js](/_utils/script/jquery.couch.js) library which is part of the CouchDB distribution.

The response is handled in one of three ways, depending on the user's session information. Either we trigger the `loggedIn` or `loggedOut` events, or in the special case where we detect that CouchDB's security is not properly configured, we trigger the `adminParty` event to warn the user.

### loggedOut

Because most visitors start logged out, let's now turn our attention to the `loggedOut` event handler to see what will greet a new visitor:

    "loggedOut": {
        "mustache": "<a href=\\"#signup\\">Signup</a> or <a href=\\"#login\\">Login</a>",
        "selectors": {
          "a[href=#login]": {
            "click": "loginForm"
          },
          "a[href=#signup]": {
            "click": "signupForm"
          }
        }
      }

There are two main components to this handler: `mustache` and `selectors`. `mustache` is a template file with two HTML links. `selectors` contains a set of CSS selectors with events bound to them. You can think of each selector as a nested Evently widget. In this case, clicking "Login" will trigger the `loginForm` event, while clicking "Signup" triggers the `signupForm` event.

### signupForm

Let's see what happens during signup. We'll skip showing the whole handler (it should be in the sidebar anyway if you clicked "run" earlier.)

When the `signupForm` event is triggered, a mustache template draws the form. Then the selectors are run, assigning this function to the form's submit event:

    function(e) {
      var name = $('input[name=name]', this).val(),
        pass = $('input[name=password]', this).val();              
      $(this).trigger('doSignup', [name, pass]);
      return false;
    }

This handler is as simple as possible, all it does is use jQuery to pull the user data from the form, and send the name and password to the `doSignup` event. We could just use a function call here, but it's nice to keep our individual events as small as possible, as this makes customizing Evently widgets simpler.

### doSignup

Here is the `doSignup` handler:

    function(e, name, pass) {
      var elem = $(this);
      $.couch.signup({
        name : name
      }, pass, {
        success : function() {
          elem.trigger("doLogin", [name, pass]);
        }
      });
    }

Again, all the complex signup logic (encrypting passwords, etc) is pushed to the [jquery.couch.js](/_utils/script/jquery.couch.js) library (via the `$.couch.signup()` call), so our application code can stay as simple as possible. When signup is complete, we trigger the `doLogin` event, so new users don't have to go through another action.

### doLogin

The code for `doLogin` isn't much different, just take the name and password, and call a jquery.couch.js library function with it.

    function(e, name, pass) {
      var elem = $(this);
      $.couch.login({
        name : name,
        password : pass,
        success : function(r) {
          elem.trigger("_init")
        }
      });      
    }

The last thing that `doLogin` does is trigger `_init`, so we come full circle! This time, `_init` will see that the user is logged in, and trigger the `loggedIn` event. You'll probably want to hook your application to this `loggedIn` event, to activate any features which are reserved for registered users. We'll cover linking events in a later section.

## Customizing the account widget

Evently widgets are built out of JSON objects, which makes it easy to replace bits and pieces of them without having to mess with the entire widget. We'll start by customizing what users see when they are logged in.

    $.couch.app(function(app){
      var customizedWidget = $.extend(true, {}, app.ddoc.vendor.couchapp.evently.account, {
        loggedIn : {
          mustache : '<span>Hello <strong>{{name}}</strong> you are logged in! ' +
            '<a href="#logout">Would you like to logout?</a></span>'
        }
      });
      $("#customWelcome").evently(customizedWidget);      
    });

Take a moment to run this example code and login to see how our custom template has replaced just one screen in the widget. The first time I did this I thought it was pretty cool. Hopefully you can think of a lot of powerful stuff you could do with it. The sky is the limit.

Here's another quick one:

    $.couch.app(function(app){
      var customizedWidget = $.extend(true, {}, app.ddoc.vendor.couchapp.evently.account, {
        loggedOut : {
          after : "function(){alert('Bye bye');}"
        }
      });
      $("#afterAlert").evently(customizedWidget);      
    });

For a deeper reference on what the various parts of an Evently widget are named, and how you can use them, see [the Evently docs page](#/topic/evently).

## Linking two widgets

First, lets create a basic widget. This one just has an `_init` handler and a handler called `loggedIn`. There is nothing in this widget definition that will trigger `loggedIn`, unless something else triggers it, there's no way it will run.

    $("#link_target").evently({
      _init : {
        mustache : "<p>Not much to see here</p>"
      },
      loggedIn : {
        mustache : "<p>loggedIn was triggered from another widget, {{name}}.</p>",
        data : function(e, r) {
          return { name : r.userCtx.name };
        }
      }
    });

Be sure to run the above example code before the next one, otherwise there won't be anything to link to.

This next block of code demonstrates how to link two widgets together. First we create a normal account widget on the `#link_source` element, then we tell Evently to connect it to the `#link_target` element. Now whenever the `loggedIn` evenr is triggered on the source, it will be triggered on the target.

    $.couch.app(function(app){
      $("#link_source").evently(app.ddoc.vendor.couchapp.evently.account);
      // link the source to the target, for the loggedIn event
      $.evently.connect($("#link_source"), $("#link_target"), ["loggedIn"]);
    });

## Conclusion

If you are writing a CouchApp that will have users logging and and logging out, you'd do well to use the account widget. It's customizable and linkable. And what's more, it's code that's already written.

Enjoy!

    