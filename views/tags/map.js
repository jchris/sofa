function(doc) {
  if(doc.tags && doc.tags.length) {
    for(var idx in doc.tags) {
      emit(doc.tags[idx], 1);
    }
  }
}