const Filter    = require('../app/server/xfrm-filter');
const Streamify = require('streamify-string');
const split     = require('split');
const test      = require('tape');

test('server-xfrm-filter: should trim whitespace', function(t) {
  t.plan(1);

  const filter = Filter();

  // bind test
  filter.on('data', function(line) {
    t.equals(line, 'foo');
  });

  // write a string with unwanted whitespace
  filter.write('  foo  ');
});

test('server-xfrm-filter: should filter empty lines', function(t) {
  t.plan(1);

  // input containing "real-time" characters
  const input = [ 'G20', '' ].join('\n');

  // establish pipeline
  Streamify(input)
    .pipe(split())
    .pipe(Filter())

    // assert that only the non-empty line is received
    .on('data', function(chunk) {
      t.equals(chunk, 'G20');
    });

});

test('server-xfrm-filter: should filter comment lines', function(t) {
  t.plan(1);

  // input containing "real-time" characters
  const input = [ 'G20', ';comment line', '(comment line)' ].join('\n');

  // establish pipeline
  Streamify(input)
    .pipe(split())
    .pipe(Filter())

    // assert that only the non-empty line is received
    .on('data', function(chunk) {
      t.equals(chunk, 'G20');
    });
});
