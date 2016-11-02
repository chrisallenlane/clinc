const Sink = require('./mock/sink');
const cmd  = require('../app/client/cmd-config');
const fs   = require('fs');
const path = require('path');
const test = require('tape');

// read the sample config file
const file   = path.join(__dirname, '../app/client/sample-config.json');
const sample = fs.readFileSync(file, 'utf8');

test('client-cmd-config: should send the appropriate file', function(t) {
  t.plan(1);

  // create a transform-stream into which to pipe command data
  const sink = Sink();

  // buffer received command output
  var output = '';
  sink.on('data', function(chunk) {
    output += chunk.toString();
  });

  // assert that the appropriate data was received
  sink.on('finish', function() {
    t.equals(output, sample);
  });

  // execute the command
  cmd({}, {}, sink);
});
