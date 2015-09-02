Errata
==========

* The code as I found it is considerably out of sync with *CouchDB:
  The Definitive Guide*. (But then the book seems to be in need of an
  update for other reasons anyway.)

* **Sofa** requires CouchDB version >= 1.1.0 in order for `require`d
    code in view `map`s to be actually included. In earlier versions
    of CouchDB, the `map` will, from the point of view of the user,
    silently fail and mysteriously (to the user) no results are
    returned.  Furthermore, in the versions I have seen that **do**
    support this, the code to be `require`d **must be** in
    `views/libs/`. `Require`ing code in other locations will, again
    silently, fail.

* There are now 4 copies of `md5.js` shipped with **Sofa** -- I had to
  add one into `views/libs/` so that the `views/comments/map.js`
  didn't fail (silently, as above).

* **Sofa** can be successfully initially deployed via `couchapp.py`,
    but **not** via `erica`: the latter fails to correctly install
    `_attachments/`, complaining thus: 

	>  <<"{\"error\":\"bad_request\",\"reason\":\"Attachment name can't start with '_'\"}\n">>}}}
	
	(full stack trace may be found at the end of this file).  However,
	after the initial deployment, I was able to use `erica`.

* `jquery.scrollTo` seems to work only intermittently, but since it is
  used only by the 'preview' functionality as a (cool!) convenience, I
  didn't wish to spend much time on it.

* Some versions of `CouchDB` (pre-1.1.0?) do *not* like the
  `views/lib/` directory to *not* have a `map.js` file in it, and go
  so far as to return an `undefined` in its place. I just put a
  **valid but unused** `map.js` in the `views/lib/` directory to get
  around this. If one doesn't do this, `CouchDB` will complain thusly:

>                           [{view,0,
>                             [<<"lib">>],
>                             undefined,
>                             {btree,<0.8974.16>,nil,
>                              #Fun<couch_btree.3.83553141>,
>                               #Fun<couch_btree.4.30790806>,
>                              #Fun<couch_view.less_json_ids.2>,
>                              #Fun<couch_view_group.10.120246376>},
>                             [],[]},
>                            {view,1,
>                             [<<"recent-posts">>],
>                             <<"function(doc) {\n  if (doc.type == \"post\") {\n    emit(new Dat
> e(doc.created_at), doc);\n  }\n};\n">>,
>                             {btree,<0.8974.16>,nil,
>                              #Fun<couch_btree.3.83553141>,
>                              #Fun<couch_btree.4.30790806>,
>                              #Fun<couch_view.less_json_ids.2>,
>                              #Fun<couch_view_group.10.120246376>},
>                             [],[]},

	and the web broweser will display:

> {"error":"compilation_error","reason":"Expression does not eval to a function. ((new String(\"undefined\")))"}


Full`erica` deployment attempt stack trace:

> DEBUG: push /my/home/dir/dev/couchdb/test/sofatest => iristest
> DEBUG: Detected Style: traditional 
> DEBUG: File '".gitignore"' ignored.
> ERROR: push failed while processing /my/home/dir/dev/couchdb/test/sofatest: {'EXIT',{{badmatch,{error,{ok,"400",
>                               [{"Server","CouchDB/1.5.0 (Erlang OTP/R15B03)"},
>                                {"Date","Sun, 30 Aug 2015 07:44:11 GMT"},
>                                {"Content-Type","application/json"},
>                                {"Content-Length","72"},
>                                {"Cache-Control","must-revalidate"}],
>                               <<"{\"error\":\"bad_request\",\"reason\":\"Attachment name can't start with '_'\"}\n">>}}},
>          [{erica_push,do_push,4,[]},
>           {erica_push,push2,3,[]},
>           {erica_push,push1,3,[]},
>           {erica_core,run_modules,4,[]},
>           {erica_core,execute,4,[]},
>           {erica,main,1,[]},
>           {escript,run,2,[{file,"escript.erl"},{line,747}]},
>           {escript,start,1,[{file,"escript.erl"},{line,277}]}]}}
