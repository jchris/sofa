function(ks, vs, rereduce) {
  if (rereduce) {
    return sum(vs);
  } else {
    return vs.length;
  }
};
