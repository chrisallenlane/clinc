#!/usr/bin/env node

// dependencies
const docopt     = require('docopt').docopt;
const fs         = require('fs');
const path       = require('path');
const pkg        = require('../../package.json');

// generate and parse the command-line options
const doc        = fs.readFileSync(path.join(__dirname, 'docopt.txt'), 'utf8');
const options    = docopt(doc, { version: pkg.version });

// load subcommands
const cmd = {
  list  : require('./cmd-list'),
  start : require('./cmd-start'),
};

// select and execute the specified subcommand
const fn = (options.list) ? cmd.list : cmd.start;
fn(options);
