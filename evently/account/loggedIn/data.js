function(e, r) {
  var app = $$(this).app;
  var path = app.require("vendor/couchapp/commonjs/path").init(app.req);
  return {
    name : r.userCtx.name,
    uri_name : encodeURIComponent(r.userCtx.name),
    auth_db : encodeURIComponent(r.info.authentication_db),
    newPostPath : path.show("edit")
  };
}
