const Grbl      = require('./mock/grbl');
const Planner   = require('./mock/planner');
const Realtime  = require('../app/server/xfrm-realtime');
const Sink      = require('./mock/sink');
const Streamify = require('streamify-string');
const split     = require('split');
const stream    = require('stream');
const test      = require('tape');

test('server-xfrm-realtime: should send "realtime" commands directly to grbl', function(t) {
  t.plan(23);
  
  // input containing "real-time" characters
  const input = [ 'a', 'b', '!', '\030', '~', 'c' ].join('\n');

  // mock streams
  const grblPlanner = Sink();
  const grbl        = Grbl(grblPlanner);
  const passthrough = new stream.PassThrough({ objectMode: true });
  const planner     = Planner();
  const realtime    = Realtime(grbl, passthrough, planner);

  grbl.on('mockpause', function() {
    // 3 times
    t.pass('GRBL should pause');
  });

  grbl.on('mockdrain', function() {
    // 6 times
    t.pass('GRBL should drain');
  });

  grbl.on('mockwrite', function() {
    // 3 times
    t.pass('GRBL should write');
  });

  planner.on('unpipe', function() {
    // 4 times (3 + initial set-up)
    t.pass('planner should unpipe');
  });

  grbl.on('mockresume', function() {
    // 3 times
    t.pass('GRBL should resume');
  });

  planner.on('pipe', function() {
    // 4 times (3 + initial set-up)
    t.pass('planner should pipe');
  });

  //// assert that the planner receives no data
  planner.on('data', function() {
    t.fail();
  });

  // establish pipeline
  Streamify(input)
    .pipe(split())
    .pipe(realtime)
    .pipe(passthrough)
    .pipe(planner);
  
});

test('server-xfrm-realtime: should send "non-realtime" commands to the passthrough', function(t) {
  t.plan(3);

  // enumerate some non-urgent
  const input = [ 'foo', 'bar', 'baz' ].join('\n');

  // initialize streams
  const grbl        = Grbl();
  const passthrough = new stream.PassThrough({ objectMode: true });
  const planner     = Planner();
  const realtime    = Realtime(grbl, passthrough, planner);

  // assert that no data is written to grbl
  grbl.on('data', function(chunk) {
    t.fail();
  });
  // assert that all data (3 chunks) goes to the passthrough
  passthrough.on('data', function(chunk) {
    t.ok(true);
  });

  // establish pipeline
  Streamify(input)
    .pipe(split())
    .pipe(realtime)
    .pipe(passthrough)
    .pipe(planner);
  
});
