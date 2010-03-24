exports.slugifyString = function(string) {
  return string.replace(/\W/g,'-').
    replace(/\-*$/,'').replace(/^\-*/,'').
    replace(/\-{2,}/,'-');
}

