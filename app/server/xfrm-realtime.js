const stream = require('stream');

module.exports = function(grbl, passthrough, planner) {

  // map of real-time commands
  const urgent = {
    '!'    : true, // feed hold
    //'?'    : true, // status: (not implemented) (HERE BE DRAGONS)
    '\030' : true, // ctrl-x (reset)
    '~'    : true, // cycle start
  };

  const realtime = new stream.Transform({ objectMode: true });

  realtime._transform = function (line, enc, next) {

    // if a "realtime command" is detected, bypass the planner and
    // send it immediately to GRBL.
    if (urgent[line]) {

      // pause grbl
      grbl.pause();

      // wait for the serial port to clear
      grbl.drain(function() {

        // unpipe passthrough from the planner
        passthrough.unpipe(planner);

        // write the "real-time" command directly to GRBL
        grbl.write(line, function() {

          // wait for the serial port to drain again
          grbl.drain(function() {

            // don't try to read the response
            grbl.flush();

            // un-pause the serial port
            grbl.resume();

            // re-attach the passthrough to get the bits flowing again
            passthrough.pipe(planner);

            // back to business
            next(null);
          });
        });
      });
    }

    // otherwise, send the line to the planner
    else {
      next(null, line);
    }
  };

  return realtime;
};
