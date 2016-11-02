const fs     = require('fs');
const path   = require('path');
const test   = require('tape');

// read the sample config file
const file   = path.join(__dirname, '../app/client/sample-config.json');
const data   = fs.readFileSync(file);

test('client-sample-config: should be valid JSON', function(t) {
  t.plan(1);

  t.doesNotThrow(function() {
    JSON.parse(data);
  });
});

test('client-sample-config: should have the appropriate properties', function(t) {
  t.plan(3);

  const config = JSON.parse(data);
  t.equals(Object.keys(config).length, 2);
  t.equals(typeof config.aliases , 'object');
  t.equals(typeof config.server  , 'object');
});
