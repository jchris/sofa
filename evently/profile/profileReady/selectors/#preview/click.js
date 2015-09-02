function() {
  var f = $(this), app = $$(this).app;
  var Mustache = app.require("lib/mustache");
  var markdown = app.require("vendor/couchapp/lib/markdown");

  var c = {
    name : $$("#profile").profile.nickname,
    url : $$("#profile").profile.url,
    avatar : $$("#profile").profile.gravatar_url,
    html : markdown.encode(Mustache.escape($("[name=comment]").val())),
    created_at : JSON.parse(JSON.stringify(new Date()))
  };
  
  $("#comment-preview").html(Mustache.to_html(app.ddoc.templates.partials.comment, c));
};
