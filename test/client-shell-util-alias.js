const test  = require('tape');
const alias = require('../app/client/shell-util-alias.js');

const config = {
  aliases: {
    'return zero' : 'G28',
  },
};

test('client-shell-util-alias: should not change commands without an alias', function(t) {

  t.plan(1);
  t.equals(alias(config, 'G20'), 'G20');

});

test('client-shell-util-alias: should change commands with an alias', function(t) {

  t.plan(1);
  t.equals(alias(config, 'return zero'), 'G28');

});
