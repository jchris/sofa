function(e) {
  var name = $('input[name=name]', this).val(),
    pass = $('input[name=password]', this).val();              
  $(this).trigger('doSignup', [name, pass]);
  return false;
}