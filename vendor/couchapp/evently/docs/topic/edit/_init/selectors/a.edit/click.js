function() {
  var pre = $(this).prev('pre');
  var js = pre.text();
  var lines = js.split('\n').length;
  var ta = $('<textarea rows="'+lines+'" class="code"></textarea>');
  ta.text(js);
  pre.replace(ta);
  return false;  
};
