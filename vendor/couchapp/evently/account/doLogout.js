function() {
  var elem = $(this);
  $.couch.logout({
    success : function() {
      elem.trigger("_init");
    }
  });
}