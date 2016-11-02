const stream = require('stream');
const lines  = [];

module.exports = function() {

  const parser = new stream.Transform({
    highWaterMark : 50, // larger than any GRBL response
    objectMode    : true,
  });

  parser._transform = function (line, enc, next) {

    // push the line into the lines buffer
    lines.push(line);

    // iterate over each line
    for (var i = 0; i < lines.length; i++) {
      var ln = lines[i];

      // split on recognized line beginnings
      if ( /^ok/.test(ln) || /^error/.test(ln) || /^\[/.test(ln)) {
        this.push(lines.splice(0, i + 1).join('\n'));
      }
    }

    next(null);
  };

  return parser;
};
