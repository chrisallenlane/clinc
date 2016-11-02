const Info       = require('./mock/info');
const ReplServer = require('./mock/replserver');
const State      = require('./mock/state');
const manual     = require('../app/client/shell-util-manual.js');
const test       = require('tape');

test('client-shell-util-manual: should send a feed manual when <F1> is pressed', function(t) {
  t.plan(2);

  const replServer = ReplServer();
  replServer.on('hold', function(gcode) {
    t.equals(gcode, '!');
  });
  replServer.on('info', function(msg) {
    t.pass();
  });

  manual(Info('f1', true), State(), replServer);
});

test('client-shell-util-manual: X-axis (left)', function(t) {
  t.plan(1);

  const replServer = ReplServer();
  replServer.on('manual', function(gcode) {
    t.equals(gcode, 'G91 G0 X-3');
  });

  manual(Info('left', true), State(), replServer);
});

test('client-shell-util-manual: X-axis (right)', function(t) {
  t.plan(1);

  const replServer = ReplServer();
  replServer.on('manual', function(gcode) {
    t.equals(gcode, 'G91 G0 X3');
  });

  manual(Info('right', true), State(), replServer);
});

test('client-shell-util-manual: Y-axis (forward)', function(t) {
  t.plan(1);

  const replServer = ReplServer();
  replServer.on('manual', function(gcode) {
    t.equals(gcode, 'G91 G0 Y3');
  });

  manual(Info('up', true), State(), replServer);
});

test('client-shell-util-manual: Y-axis (rearward)', function(t) {
  t.plan(1);

  const replServer = ReplServer();
  replServer.on('manual', function(gcode) {
    t.equals(gcode, 'G91 G0 Y-3');
  });

  manual(Info('down', true), State(), replServer);
});

test('client-shell-util-manual: Z-axis (upward)', function(t) {
  t.plan(1);

  const replServer = ReplServer();
  replServer.on('manual', function(gcode) {
    t.equals(gcode, 'G91 G0 Z3');
  });

  manual(Info('pageup', false), State(), replServer);
});

test('client-shell-util-manual: Z-axis (downward)', function(t) {
  t.plan(1);

  const replServer = ReplServer();
  replServer.on('manual', function(gcode) {
    t.equals(gcode, 'G91 G0 Z-3');
  });

  manual(Info('pagedown', false), State(), replServer);
});
