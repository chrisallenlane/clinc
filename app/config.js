const lodash = require('lodash');
const pkg    = require('../package.json');

module.exports = function(options) {

  // load rc configs
  const config = require('rc')(pkg.name, {
    server: {
      baudRate   : 115200,
      serverPort : 9283,
      serialPort : '/dev/ttyACM0',
    },
  });

  // apply overrides via the CLI flags
  lodash.merge(config.server, {
    baudRate   : options['--baudrate']    || undefined,
    serverPort : options['--server-port'] || undefined,
    serialPort : options['--serialport']  || undefined,
  });

  return config;
};
