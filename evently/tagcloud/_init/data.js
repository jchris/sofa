function(resp) {
  var tags = resp.rows.map(function(r) {
    return {
      tag : r.key,
      // todo use a new mustache delimiter for this
      tag_uri : encodeURIComponent(r.key),
      size : (r.value * 2) + 10
    };
  }).sort(function(a, b) {
    return a.size < b.size;
  });
  return {tags:tags};
}
