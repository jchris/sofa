function(e) {
  try {
    function err(y, id) {
      $('#'+id).html(['<p>Error running #', id, 
      ' code block:</p><p><pre>',
      (y.toSource ? y.toSource() : JSON.stringify(y)),
      '</pre></p>'].join(''));
    }
    var id = e.data.args[1];
    var example = $("#code-"+id);
    var js = $('textarea',example).val() || $('pre',example).text();
    $('#'+id).unbind();
    try {
      eval(js);            
    } catch (y) {
      err(y, id);
    }
  } catch(x) {
    err(x, id);
  }
  return false;
}