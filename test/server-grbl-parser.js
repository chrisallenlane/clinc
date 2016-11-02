const Parser    = require('../app/server/xfrm-grbl-parser');
const Streamify = require('streamify-string');
const split     = require('split');
const test      = require('tape');

test('server-xfrm-grbl-parser: "ok" response', function(t) {
  t.plan(1);

  // mock some gcode
  const input = [ 'foo', 'ok' ].join('\n');

  // init the parser
  const parser = Parser();

  // establish pipeline and test
  Streamify(input)
    .pipe(split())
    .pipe(parser)
    .on('data', function(chunk) {
      t.equals(chunk.toString(), 'foo\nok');
    });

});

test('server-xfrm-grbl-parser: "error" response', function(t) {
  t.plan(1);

  // mock some gcode
  const input = [ 'foo', 'error' ].join('\n');

  // init the parser
  const parser = Parser();

  // establish pipeline and test
  Streamify(input)
    .pipe(split())
    .pipe(parser)
    .on('data', function(chunk) {
      t.equals(chunk.toString(), 'foo\nerror');
    });

});

test('server-xfrm-grbl-parser: bracketed response', function(t) {
  t.plan(1);

  // mock some gcode
  const input = [ 'foo', '[ALARM]' ].join('\n');

  // init the parser
  const parser = Parser();

  // establish pipeline and test
  Streamify(input)
    .pipe(split())
    .pipe(parser)
    .on('data', function(chunk) {
      t.equals(chunk.toString(), 'foo\n[ALARM]');
    });

});
