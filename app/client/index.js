#!/usr/bin/env node

// dependencies
const Config  = require('../config');
const docopt  = require('docopt').docopt;
const fs      = require('fs');
const path    = require('path');
const pkg     = require('../../package.json');

// subcommands
const cmd = {
  config : require('./cmd-config'),
  send   : require('./cmd-send'),
  shell  : require('./cmd-shell'),
};

// generate and parse the command-line options
const doc     = fs.readFileSync(path.join(__dirname, 'docopt.txt'), 'utf8');
const options = docopt(doc, { version: pkg.version });

// load the configs
const config  = Config(options);

// execute the appropriate subcommand
const subcommand = 
  (options.send)  ? cmd.send  :
  (options.shell) ? cmd.shell : cmd.config ;

subcommand(options, config);
