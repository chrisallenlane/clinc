const Sink = require('./mock/sink');
const cmd  = require('../app/client/cmd-send');
const path = require('path');
const test = require('tape');

test('client-cmd-send: should send commands from CLI', function(t) {
  t.plan(1);

  // create a transform-stream into which to pipe command data
  const sink   = Sink();
  sink.destroy = function() {};

  // buffer received command output
  sink.on('data', function(chunk) {
    t.equals(chunk.toString(), 'G28\n');
  });

  // execute the command
  cmd({ '<commands>' : 'G28' }, {}, sink);
});

test('client-cmd-send: should honor aliases on the CLI', function(t) {
  t.plan(1);

  // create a transform-stream into which to pipe command data
  const sink   = Sink();
  sink.destroy = function() {};

  // mock configs
  const config = {
    aliases: {
      inches: 'G20',
    },
  };

  // buffer received command output
  sink.on('data', function(chunk) {
    t.equals(chunk.toString(), 'G20\n');
  });

  // execute the command
  cmd({ '<commands>' : 'inches' }, config, sink);
});

test('client-cmd-send: should send files from the CLI', function(t) {
  t.plan(1);

  // create a transform-stream into which to pipe command data
  const sink   = Sink();
  sink.destroy = function() {};

  // buffer received command output
  sink.on('data', function(chunk) {
    t.equals(chunk.toString(), 'G20 G90\n');
  });

  // mock the options
  const options = { '--file' : path.join(__dirname, './mock/mock.nc') };

  // execute the command
  cmd(options, {}, sink);
});
