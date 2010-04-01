exports.get = function(db, docid, setFun, getFun) {
  db.openDoc(docid, {
    success : function(doc) {
      getFun(doc.cache);
    },
    error : function() {
      setFun(function(cache) {
        db.saveDoc({
          _id : docid,
          cache : cache
        });
        getFun(cache);
      });
    }
  });
};

exports.clear = function(db, docid) {
  db.openDoc(docid, {
    success : function(doc) {
      db.removeDoc(doc);
    },
    error : function() {}
  });
};
