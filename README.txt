== Standalone CouchDB Blog

Showcases the practicality of pure CouchDB applications.

It's just HTML + JavaScript plus a little bit of action servers and the magic of
CouchDB.

When CouchDB's security model comes online there will be no reason not to deploy
this in public.

There are more dependencies than we'd expect to get it running. I will cut down
on these. However, if you want to try it now (including the Atom feeds), you'll
need to build from this version of CouchDB: http://github.com/jchris/couchdb/tree/action2

Here's how:

git clone git://github.com/jchris/couchdb.git
cd couchdb
git pull origin action2
./bootstrap
./configure
make && sudo make install

Once you have that installed and the tests passing, you can install couchrest
and the blog software.

# install the latest couchrest (all we really need is `couchapp`)
# sudo gem install jchris-couchrest -s http://gems.github.com
# NOTE gem build has fallen behind, use this procedure instead

git clone git://github.com/jchris/couchrest.git
cd couchrest
gem build couchrest.gemspec

# gonna need deps (maybe I should make a standalone `couchapp`...)
sudo gem install extlib
sudo gem install rest-client
sudo gem isntall json

# sudo due to executables...
sudo gem install couchrest-*.gem

# install the blog
# ================

git clone git://github.com/jchris/couchdb-example-blog.git

# edit doc.json to setup your blog's information.

cd couchdb-example-blog/

# use couchapp (provided by couchrest) to push the thing.
couchapp push . blogdb

# visit the index page
http://localhost:5984/blogdb/_design%2Fcouchdb-example-blog/index.html


# TODO
work out conventions with paths and dbnames to make it more foolproof.
