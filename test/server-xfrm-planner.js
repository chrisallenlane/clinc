const Grbl      = require('./mock/grbl');
const Planner   = require('../app/server/xfrm-planner');
const Sink      = require('./mock/sink');
const Streamify = require('streamify-string');
const split     = require('split');
const test      = require('tape');

test('server-xfrm-planner: should interact with GRBL', function(t) {
  t.plan(8);

  // mock some gcode
  const input = [ 'G20', 'G90' ].join('\n');

  // mock streams
  const grblParser = Sink();
  const grbl       = Grbl(grblParser);
  const planner    = Planner(grbl, grblParser);

  // establish pipeline
  Streamify(input)
    .pipe(split())
    .pipe(planner)
    .on('data', function(chunk) {
      t.ok(chunk.command  , 'should receive json.command.');
      t.ok(chunk.response , 'should receive json.response.');
    });

  grbl.on('mockwrite', function(data) {
    grbl.emit('data', data);
    t.pass('should write');
  });

  grbl.on('mockdrain', function() {
    t.pass('should drain');
  });
});
