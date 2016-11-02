const stream = require('stream');

module.exports = function(grbl) {

  // initialize the stream
  const planner = new stream.Writable({ objectMode : true });

  // just drop the inbound data
  planner._write = function(line, enc, callback) {
      return callback();
  };

  // return the planner stream
  return planner;
};
