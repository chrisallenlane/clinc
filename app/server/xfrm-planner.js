const stream = require('stream');

module.exports = function(grbl, grblParser) {

  // initialize the stream
  const planner = new stream.Transform({ objectMode : true });

  // implement a `_transform` method that wraps the GRBL serialport interface
  planner._transform = function(line, enc, next) {

    // call back when the serial port responds
    grblParser.once('data', function(chunk) {

      grbl.drain(function() {
        next(null, {
          command  : line,
          response : chunk.toString(),
        });
      });

    });

    // write to the serial port
    grbl.write(line + '\n');
  };

  // return the planner stream
  return planner;
};
