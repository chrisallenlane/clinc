const stream = require('stream');

// NB: this is a simple sink to be used in unit-testing. 
module.exports = function() {

  const sink = new stream.Transform({ objectMode: true });

  sink._transform = function (line, enc, next) {
    next(null, line);
  };

  return sink;
};
