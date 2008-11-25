function(doc) {
  // only posts have slugs, dates, and bodies
  if (doc.created_at && doc.slug && doc.body) emit(doc.created_at, null);
};