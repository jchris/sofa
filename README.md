# Sofa: Standalone CouchDB Blog

SofasShowcases the practicality of pure CouchDB applications. It should provide an easy way for people to put thier thoughts online, anywhere there's a Couch. It's just HTML, JavaScript and the magic of CouchDB.

Currently supports admin-only posting

## Install CouchDB

You'll also need CouchDB's svn trunk, which is currently a moving target, with regard to the new features, especially the `_show` API, that Sofa relies on.

    svn checkout http://svn.apache.org/repos/asf/couchdb/trunk
    cd trunk && cat README

Once you have that installed and the tests passing, you can install couchrest
and the blog software.

## Install CouchApp

Installing the Ruby Gem should be pretty quick if you're already setup with Ruby and RubyGems. If you don't already have a Ruby development environment (OSX comes with Ruby, on Debian system, look for `ruby-dev`) there's work on a Python version of the CouchApp script. 

    sudo gem install couchapp

CouchApp is a set of utilities for developing standalone CouchDB applications You can [learn more about the CouchApp project here](http://github.com/jchris/couchapp/tree/master).


## Install Sofa

    git clone git://github.com/jchris/sofa.git
    cd sofa
    couchapp push . blog-db 
  
See your new blog at: `http://localhost:5984/blog-db/_design/sofa/index.html`

You'll want to edit the HTML and CSS to personalize your site. Don't worry, the markup is pretty basic, so it's easy to rework. Adding new features is just a few lines of JavaScript away.

Anytime you make edits to the on-disk version of Sofa, and want to see them in your browser, just run `couchapp push . myblogdb` again.


# TODO
links in the atom feed are correct
fulltext search?
