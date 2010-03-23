function(resp) {
  var app = $$(this).app;
  var path = app.require("vendor/couchapp/lib/path").init(app.req);
  var tags = [];
  resp.rows.forEach(function(r) {
    if (r.value < 2) return;
    var tag = r.key[0];
    var link = path.list("index","tags",{
      descending : true, 
      reduce : false, 
      startkey : [tag, {}], 
      endkey : [tag]});
    tags.push({
      tag : tag,
      link : link,
      size : (r.value * 2) + 10
    });
  });
  return {
    tags : tags.sort(function(a, b) {
      return a.size < b.size;
    })
  };
}
