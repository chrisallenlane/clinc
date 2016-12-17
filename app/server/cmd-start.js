const Config     = require('../config');
const Filter     = require('./xfrm-filter');
const GrblParser = require('./xfrm-grbl-parser');
const Logger     = require('./writable-logger');
const Planner    = require('./xfrm-planner');
const Realtime   = require('./xfrm-realtime');
const SerialPort = require('serialport');
const net        = require('net');
const split      = require('split');
const stream     = require('stream');


module.exports = function(options) {

  // load the configs
  const config     = Config(options);

  // a transform stream to parse GRBL output
  const grblParser = GrblParser();

  // open a serialport connection to GRBL
  const grbl = new SerialPort(config.server.serialPort, {
    baudRate : Number(config.server.baudRate),
    parser   : SerialPort.parsers.readline('\r\n'),
  });

  // interface with the client
  const server = net.createServer();
  server.listen(config.server.serverPort);

  // establish the pipeline
  const planner     = Planner(grbl, grblParser);
  const passthrough = new stream.PassThrough({ objectMode: true });
  passthrough
    .pipe(planner)
    .pipe(Logger(options['--colorize']));

  grbl
    // handle serial port errors
    .on('error', function(err) {
      console.warn('GRBL serial port error: ' + err.message);
      process.exit(1);
    })

    // notify the user when the connection closes
    .on('close', function() {
      console.warn('Connection to GRBL has closed.');
      process.exit(1);
    })

    // connect GRBL to its parser on connection open
    .on('open', function() {
      setTimeout(function() {

        // dump the connection banner
        grbl.flush();

        // pipe GRBL output into the GRBL parser
        grbl.pipe(grblParser);
      }, 250);
    });

  // establish the pipeline on client connection
  server.on('connection', function(client) {

    const realtime = Realtime(grbl, passthrough, planner);

    client
      .pipe(split())   // split bytes from stdin into lines
      .pipe(Filter())  // Filter comments and empty lines; trim whitespace
      .pipe(realtime)  // monitor for "real-time" events

      // NB: we cannot `pipe()` to passthrough here, because we don't want to
      // propagate the `end` (etc) events - we only want data. We need
      // passthrough to stay open until clinc-server is terminated.
      .on('data', function(chunk) {
        passthrough.write(chunk);
      });
  });
};
