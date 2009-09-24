
log = console && console.log || alert;

function setupDB(design) {
  var testPath = document.location.toString().split('?')[1];
  var pathParts = testPath.split('/');
  log(pathParts)
  var appDB = new CouchDB(pathParts[1]);
  var thisDesign = appDB.open('_design/'+pathParts[3], {attachments:true});
  delete thisDesign._rev;
  
  var db = new CouchDB(pathParts[1]+"-test");
  db.deleteDb();
  db.createDb();
  db.save(thisDesign);
  
  return db;  
}

function getUserName(blogDb) {
  JSON.parse(CouchDB.request("GET", "/_session").responseText).name
};

var couchTests = {
  save_only_own_doc : function(debug) {
    var db = setupDB();
    if (debug) debugger;
    T(true);
    // create a doc without an author
    T(db.save({"normal":"doc"}).ok);
    
    var name = getUserName(db);
    
    // get myname back = create a doc with an author = _self
    var r = db.save({"author":name})
    // doc.author = myname save should work
    T(r.ok)
    var doc = db.open(r.id);
    doc.title = "Something"
    T(db.save(doc).ok)
    doc.title = "Something Else"
    T(db.save(doc).ok)
    // change author should fail
    doc.author = "not "+name;
    try {
      db.save(doc)
      T(false && "fail: you can't change the author")      
    } catch(e) {
      T(e.error == "forbidden")
    }
  }
}