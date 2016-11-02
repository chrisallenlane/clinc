module.exports = function(line) {

  // Comment lines start with ';'
  if (line.charAt(0) === ';') {
    return true;
  }

  // Comment lines match this:
  //   '(DIAMOND, CIR, SQ TEST PROGRAM)'
  //
  // But not this:
  //   '(foo)Bar(baz)'
  //
  // Because the latter does contain non-comment information. (I don't believe
  // this will occur often in real code.)
  if (line.match(/^[\(].*\)$/g) && !line.match(/\).*\(/g)) {
    return true;
  }

  // If there have been no matches, the current line is not a comment line
  return false;
};
