const Rcmds      = require('../app/client/shell-util-repl-commands');
const Replserver = require('./mock/replserver');
const State      = require('./mock/state');
const chalk      = require('chalk');
const table      = require('text-table');
const test       = require('tape');

// mock config
const config = {

  aliases : {
    'check mode'   : '$C',
    'cycle start'  : '~',
    'feed hold'    : '!',
  },

  server : {
    baudRate   : 115200,
    serverPort : 9283,
    serialPort : '/dev/ttyACM0',
  }

};

const rcmds = Rcmds(config, State());

test('client-shell-util-repl-commands: "aliases" should return a table of aliases', function(t) {
  t.plan(1);

  // define the expected result
  const expected = table(Object.keys(config.aliases).map(function(key) {
    return [ key, config.aliases[key] ];
  }));

  // mock the replserver
  const replServer = Replserver();
  replServer.defineCommand('aliases', rcmds.aliases);

  // bind the test
  replServer.on('info', function(msg) {
    t.equals(msg, chalk.green(expected));
  });

  // execute the dotcommand
  replServer.action();

});

test('client-shell-util-repl-commands: "cheat" should return a cheatsheet', function(t) {
  t.plan(1);

  // mock the replserver
  const replServer = Replserver();
  replServer.defineCommand('cheat', rcmds.cheat);

  // bind the test
  replServer.on('info', function(msg) {
    t.equals(typeof msg, 'string');
  });

  // execute the dotcommand
  replServer.action();

});

test('client-shell-util-repl-commands: "step" should error if no input is provided', function(t) {
  t.plan(1);

  // define the expected result
  const expected = 'Step value must be a number.\nExample: .step 0.5';

  // mock the replserver
  const replServer = Replserver();
  replServer.defineCommand('step', rcmds.step);

  // bind the test
  replServer.on('info', function(msg) {
    t.equals(msg, chalk.red(expected));
  });

  // execute the dotcommand
  replServer.action();

});

test('client-shell-util-repl-commands: "step" should error if a non-number is provided', function(t) {
  t.plan(1);

  // define the expected result
  const expected = 'Step value must be a number.\nExample: .step 0.5';

  // mock the replserver
  const replServer = Replserver();
  replServer.defineCommand('step', rcmds.step);

  // bind the test
  replServer.on('info', function(msg) {
    t.equals(msg, chalk.red(expected));
  });

  // execute the dotcommand
  replServer.action('foo');

});

test('client-shell-util-repl-commands: "step" set the step value', function(t) {
  t.plan(1);

  // define the expected result
  const expected = 'Step value changed to 3.';

  // mock the replserver
  const replServer = Replserver();
  replServer.defineCommand('step', rcmds.step);

  // bind the test
  replServer.on('info', function(msg) {
    t.equals(msg, chalk.green(expected));
  });

  // execute the dotcommand
  replServer.action('3');

});
