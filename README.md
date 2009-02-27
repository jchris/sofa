# Sofa: Standalone CouchDB Blog

Sofa showcases the [potential of pure CouchDB applications](http://jchris.mfdz.com/code/2008/10/standalone_applications_with_co). It should provide an easy way for people to put thier thoughts online, anywhere there's a running Couch. It's just HTML, JavaScript and the magic of CouchDB.

Currently supports admin-only posting and anonymous comments.

## Current News

Things are moving crazy fast around here right now as I bring this stuff up to ship-shape for the [CouchDB book](http://books.couchdb.org). I'll be renaming methods and stuff (if I find the time), any API feedback will be appreciated.

## Install CouchDB

You'll also need CouchDB's svn trunk, which is currently a moving target, with regard to the new features, especially the `_show` API, that Sofa relies on.

    svn checkout http://svn.apache.org/repos/asf/couchdb/trunk
    cd trunk && cat README

Once you have that installed and the tests passing, you can install CouchApp
and the blog software. 

### Setup Admin Access

If you are going to put your blog in public, you'll want to follow the [instructions on the CouchDB wiki about how to set up an Admin account](http://wiki.apache.org/couchdb/Setting_up_an_Admin_account).

Note that admin accounts are still new, and that they may have strange impacts on the ability to replicate design docs or databases that contain validation functions.

## Install CouchApp

CouchApp makes it easy to edit application that are hosted in CouchDB, by keeping a correspondence between a set of files, and a CouchDB design document.

    sudo easy_install couchapp

CouchApp is a set of utilities for developing standalone CouchDB applications You can [learn more about the CouchApp project here](http://github.com/jchris/couchapp/tree/master).

## Install Sofa

    git clone git://github.com/jchris/sofa.git
    cd sofa
    couchapp push http://127.0.0.1:5984/blogdb 
  
You'll want to edit the HTML and CSS to personalize your site. Don't worry, the markup is pretty basic, so it's easy to rework. Adding new features is just a few lines of JavaScript away.

Anytime you make edits to the on-disk version of Sofa, and want to see them in your browser, just run `couchapp push http://127.0.0.1:5984/blogdb` again. You probably want to setup your `.couchapprc` file. You should read the CouchApp readme to learn about that.

You can customize the blog title and other stuff in the `blog.json` file.

You can customize the blog title and other stuff in the `blog.json` file.

# Relax

[Visit your new blog.](http://127.0.0.1:5984/blogdb/_design/sofa/index.html)


### Todo

 * fulltext search?
 * non-hack login method
 * atom feed
 