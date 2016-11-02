const isComment = require('./util-is-comment');
const stream    = require('stream');

module.exports = function() {

  const filter = new stream.Transform({ objectMode: true });

  filter._transform = function (line, enc, next) {

    // trim whitespace
    line = line.trim();

    // ignore empty and comment lines
    if (line === '' || isComment(line)) {
      return next();
    }

    // continue
    next(null, line);
  };

  return filter;
};
