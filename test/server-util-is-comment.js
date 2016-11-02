const isComment = require('../app/server/util-is-comment.js');
const test      = require('tape');

test('server-util-is-comment: lines not containing comments should not be identified as comments', function(t) {
  t.plan(1);
  t.equals(false, isComment('G1 X0 Y0 Z0 F100'));
});

test('server-util-is-comment: lines beginning with ";" should be identified as comments', function(t) {
  t.plan(1);
  t.equals(true, isComment('; Operation: 0'));
});

test('server-util-is-comment: lines containing ";" should not be identified as comments', function(t) {
  t.plan(1);
  t.equals(false, isComment('G20 ; Set units to inches'));
});

test('server-util-is-comment: lines enclosed within "(" and ")" should be identified as comments', function(t) {
  t.plan(1);
  t.equals(true, isComment('(DIAMOND, CIR, SQ TEST PROGRAM)'));
});

test('server-util-is-comment: lines containing ") (" should not be identified as comments', function(t) {
  t.plan(1);
  t.equals(false, isComment('(foo)bar(baz)'));
});

test('server-util-is-comment: "$" commands should not be identified as comments', function(t) {
  t.plan(1);
  t.equals(false, isComment('$X'));
});
