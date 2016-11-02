const stream = require('stream');
const noop   = function() {};

// NB: this is a simple grbl to be used in unit-testing. 
module.exports = function(grblParser) {

  const grbl = new stream.Transform({ objectMode: true });

  grbl._transform = function (line, enc, next) {
    next(null, line);
  };

  grbl.write = function(data, callback) {
    this.emit('mockwrite', data);
    process.nextTick(function() {
      grblParser.write(data);
      if (callback) { return callback(); }
    });
  };

  grbl.drain = function(callback) {
    this.emit('mockdrain');
    process.nextTick(callback || noop);
  };

  grbl.flush = noop;

  grbl.pause = function() {
    this.emit('mockpause');
  };

  grbl.resume = function() {
    this.emit('mockresume');
  };

  return grbl;
};
