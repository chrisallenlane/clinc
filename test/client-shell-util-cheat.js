const cheat = require('../app/client/shell-util-cheat.js');
const test  = require('tape');

// simply assert that a cheatsheet is returned
test('client-shell-util-cheat: should return a string', function(t) {
  t.plan(1);
  t.equals(typeof cheat(), 'string');
});
