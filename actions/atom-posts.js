function(req, db) {
  
  var view = db.view('purecouchblog/recent',{count:10,descending:true});
  
  // var view = {"total_rows":2,"offset":0,"rows":[
  // {
  //   "id":"75c2c107ef89d8fd8a33f9ce8cd38b83",
  //   "key":"2008-10-28T19:34:23Z",
  //   "value":{"_id":"75c2c107ef89d8fd8a33f9ce8cd38b83","_rev":"34647434",
  //     "title":"First Post",
  //     "body":"Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\n",
  //     "author":"Chris Anderson","date":"2008-10-28T19:34:23Z"}},
  // {
  //   "id":"64ac01b140cb5d1010e1d02637b756aa",
  //   "key":"2008-10-28T19:37:36Z",
  //   "value":{"_id":"64ac01b140cb5d1010e1d02637b756aa","_rev":"855586439",
  //   "title":"Danger","body":"Toast is the most.","date":"2008-10-28T19:37:36Z"}}
  // ]};
  
  var feed = <feed><entries></entries></feed>;
  for (r in view.rows) {
    var post = view.rows[r].value;
    var entry = <entry/>;
    entry.title = post.title;
    entry.body = post.body;
    feed.entries.entry += entry;    
  }
  
  return {body: feed.toXMLString()};
};