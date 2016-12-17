const SerialPort = require('serialport');
const lodash     = require('lodash');

module.exports = function(options) {

  SerialPort.list(function (err, ports) {

    // handle errors
    if (err) {
      console.warn(err);
      process.exit(1);
    }

    // filter out the standard ttys and such
    ports = lodash.filter(ports, 'pnpId');

    // display the output
    console.log(
      (ports.length === 0)
        ? 'No serialports detected.' 
        : JSON.stringify(ports, null, ' ')
    );
  });

};
