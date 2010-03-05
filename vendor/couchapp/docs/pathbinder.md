# Docs about $.pathbinder

Pathbinder is a tiny framework for triggering events based on paths in URL hash. For example, you might want to render one panel when the user clicks a link to `#/foo` and another when the URL hash changes to `#/bar`. If you've never used URL hashes for application state in an Ajax app before, prepare to be happy. 

There are two big advantages to having the state in the URL-hash. One is that users can bookmark screens they may have reached by navigating within your app. The other is that the back button will continue to work.

The page you are on has a URL hash of `#/topic/pathbinder` right now. You can follow links to other "pages" within this application, and Pathbinder takes care of triggering the proper events.

## A simple example

    $("#basic_path").html('<p><a href="#/foo">click for foo</a></p>');
    $("#basic_path").bind("foo", function() {
      $(this).html("<p>you went to foo</p>");
    });
    $("#basic_path").pathbinder("foo", "/foo");

This code sets up the `#basic_path` div with some initial content, including a link to `#/foo`. If you click the link to foo, you'll see the URL change. It is the changed URL which Pathbinder sees and uses to trigger any running code. You can experiment by manually entering the `#/foo` URL hash, instead of clicking the link, and you'll see that it also triggers the `foo` event.

## Using path parameters

Pathbinder was inspired by the path handling in [Sammy.js](http://github.com/aq/sammy.js). Like Sammy, you can use it to pull parameters from the URL-hash. This page can be linked [using a path that has "pathbinder" as a parameter](#/topic/pathbinder). Let's explore how you can pull parameters out of a path.

    $("#param_path").html('<p><a href="#/foo/super">click for super foo</a></p>');
    $("#param_path").bind("foo", function(e, params) {
      $(this).html("<p>you went to foo - "+params.id+"</p>");
    });
    $("#param_path").pathbinder("foo", "/foo/:id");

When you click the link to super foo, you'll see the param is passed through the event. You can also edit the URL to see that "super" is not hard coded and can be replaced with other values.

## Pathbinder with Evently

It should be no suprise that Pathbinder and Evently play well together. The gist of it is that Evently looks for a key called `path` and if it finds it, uses Pathbinder to connect that event handler to the path. Let's try it out:

    $("#evently_path").evently({
      _init : {
        path : '/index',
        mustache : '<p>the index. <a href="#/cowbell">more cowbell!</a></p>'
      },
      cowbell : {
        path : '/cowbell',
        mustache : '<p>Now that is a lot of cowbell. <a href="#/index">back to the index</a></p>'
      }
    });

Note that when you use an Evently path, Evently also takes care to visit the path when the corresponding event is triggered. So running the above example code (which automatically triggers the `_init` event) will set the hash to `#/index`. If you were to trigger the `cowbell` event through non-path means, you'd see that it changes the path to `#/cowbell` anyway. 

### Too many widgets

One thing worth noting: there is only one URL hash for any given page, so be aware that if you have multiple widgets competing for the real-estate, they could conflict with each other. Pathbinder won't do anything when presented with a path it doesn't care about (go ahead, try out some non-sense ones on this page). 

This means that if you have a few widgets all using the path, the page should still behave in a useful way. However, this breaks down if you intend people to be able to use the URL hash to link to page state. Since there can be only one URL hash, whichever action they took last will be reflected in the bookmarked URL. For this reason it makes sense to limit yourself to one path-based Evently widget per page.
