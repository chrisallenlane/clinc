const stream = require('stream');

// mock the console for cleaner testing
module.exports = function() {

  const mockconsole = new stream.Transform({ objectMode: true });

  mockconsole._transform = function (line, enc, next) {
    next(null, line);
  };

  mockconsole.log = function(data) {
    this.emit('data', data);
  };

  return mockconsole;
};
