const Logger      = require('../app/server/writable-logger');
const MockConsole = require('./mock/console');
const chalk       = require('chalk');
const test        = require('tape');

test('server-writable-logger: should log output (no color)', function(t) {
  t.plan(1);

  // mocks
  const mockconsole = MockConsole();
  const json        = { command: 'G20', response: 'ok' };

  // initialize the logger
  const logger      = Logger(false, mockconsole);

  // bind the tests
  mockconsole.on('data', function(chunk) {
    t.equals(chunk, JSON.stringify(json), 'should stringify JSON');
  });

  // write the JSON to the logger
  logger.write(json);

});

test('server-writable-logger: should log output (with color) (ok)', function(t) {
  t.plan(1);

  // mocks
  const mockconsole = MockConsole();
  const json        = { command: 'G20', response: 'ok' };

  // initialize the logger
  const logger      = Logger(true, mockconsole);

  // bind the tests
  mockconsole.on('data', function(chunk) {

    // assemble the expected colorized output
    const expected = [
      chalk.gray('{"command":"'),
      chalk.white('G20'),
      chalk.gray('","response":"'),
      chalk.green('ok'),
      chalk.gray('"}'),
    ].join('');

    t.equals(chunk, expected, 'should stringify and colorize JSON');
  });

  // write the JSON to the logger
  logger.write(json);

});

test('server-writable-logger: should log output (with color) (error)', function(t) {
  t.plan(1);

  // mocks
  const mockconsole = MockConsole();
  const json        = { command: 'foo bar', response: 'error' };

  // initialize the logger
  const logger      = Logger(true, mockconsole);

  // bind the tests
  mockconsole.on('data', function(chunk) {

    // assemble the expected colorized output
    const expected = [
      chalk.gray('{"command":"'),
      chalk.white('foo bar'),
      chalk.gray('","response":"'),
      chalk.red('error'),
      chalk.gray('"}'),
    ].join('');

    t.equals(chunk, expected, 'should stringify and colorize JSON');
  });

  // write the JSON to the logger
  logger.write(json);

});

test('server-writable-logger: should log output (with color) (settings)', function(t) {
  t.plan(1);

  // mocks
  const mockconsole = MockConsole();
  const json        = { command: '$N', response: '$N0=' };

  // initialize the logger
  const logger      = Logger(true, mockconsole);

  // bind the tests
  mockconsole.on('data', function(chunk) {

    // assemble the expected colorized output
    const expected = [
      chalk.gray('{"command":"'),
      chalk.white('$N'),
      chalk.gray('","response":"'),
      chalk.cyan('$N0='),
      chalk.gray('"}'),
    ].join('');

    t.equals(chunk, expected, 'should stringify and colorize JSON');
  });

  // write the JSON to the logger
  logger.write(json);

});

test('server-writable-logger: should log output (with color) (info)', function(t) {
  t.plan(1);

  // mocks
  const mockconsole = MockConsole();
  const json        = { command: '$X', response: '[Caution: Unlocked]' };

  // initialize the logger
  const logger      = Logger(true, mockconsole);

  // bind the tests
  mockconsole.on('data', function(chunk) {

    // assemble the expected colorized output
    const expected = [
      chalk.gray('{"command":"'),
      chalk.white('$X'),
      chalk.gray('","response":"'),
      chalk.yellow('[Caution: Unlocked]'),
      chalk.gray('"}'),
    ].join('');

    t.equals(chunk, expected, 'should stringify and colorize JSON');
  });

  // write the JSON to the logger
  logger.write(json);

});
