function(e, id) {
  var editable = $(this);
  if ($$(editable)._init_ran) {return false;}
  // add edit link
  var edit = $('<a class="edit" href="#edit">edit code</a>');
  editable.append(edit);

  // add run box
  var example = $('<div class="example"><a class="run" href="#'+id+'">run <strong>#'+id+'</strong></a><div id="'+id+'"><strong>#'+id+'</strong> output will be here</div></div>');  
  var s = $("#sidebar");
  var o = s.offset();
  example.offset({
    left: o.left
  });
  example.width(s.width()*0.75);
  editable.prepend(example);
  $$(editable)._init_ran = true;
  return false;
}