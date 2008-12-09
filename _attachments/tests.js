
function setupDB(design) {
  var testPath = document.location.toString().split('?')[1];
  var pathParts = testPath.split('/');
  
  var appDB = new CouchDB(pathParts[1]);
  var thisDesign = appDB.open(unescape(pathParts[2]), {attachments:true});
  delete thisDesign._rev;
  
  var db = new CouchDB(pathParts[1]+"-test");
  db.deleteDb();
  db.createDb();
  db.save(thisDesign);
  
  return db;  
}

var tests = {
  signup_creates_a_user_document : function(debug) {
    var db = setupDB();
    if (debug) debugger;
    T(true);
  }
}