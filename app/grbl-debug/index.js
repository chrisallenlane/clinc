#!/usr/bin/env node

/**
 * This is a simple GRBL interface that was used while developing clinc. You
 * are unlikely to need it.
 */

// dependencies
const Config     = require('../config');
const GrblParser = require('../server/xfrm-grbl-parser');
const SerialPort = require('serialport');
const docopt     = require('docopt').docopt;
const fs         = require('fs');
const path       = require('path');
const pkg        = require('../../package.json');

// generate and parse the command-line options
const doc        = fs.readFileSync(path.join(__dirname, 'docopt.txt'), 'utf8');
const options    = docopt(doc, { version: pkg.version });

// load the configs
const config     = Config(options);

// open a serialport connection to GRBL
const grbl = new SerialPort(config.server.serialPort, {
  baudRate : Number(config.server.baudRate),
  parser   : SerialPort.parsers.readline('\r\n'),
});

// a transform stream to parse GRBL output
const grblParser = GrblParser();
grbl.pipe(grblParser);

// write after GRBL boots
grbl
  .on('error', function(err) {
    console.warn('GRBL serial port error: ' + err.message);
    process.exit(1);
  })
  .on('open', function() {
    setTimeout(function() {
      grbl.write('$X\n', function() {
        grbl.drain(function() {
          grbl.write(options['<command>'] + '\n');
        });
      });
    }, 250);
  });

// parse two responses and then end
var responses = 0;
grblParser.on('data', function(chunk) {
  responses++;
  console.log(chunk.toString());

  if (responses === 2) {
    process.exit();
  }
});
