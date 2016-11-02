const alias = require('./shell-util-alias');
const fs    = require('fs');
const net   = require('net');

module.exports = function(options, config, server) {

  // NB: `server` may optionally be passed as an argument to allow for cleaner
  // unit-testing
  server = server || net.createConnection({ port: config.server.serverPort });

  // send a command to the server
  if (options['<commands>']) {

    // apply aliases
    const cmd = alias(config, options['<commands>'].trim()).trim();

    // write to the server
    server.write(cmd + '\n', function() {
      server.destroy();
    });
  }

  // send a file to the server
  if (options['--file']) {
    fs.createReadStream(options['--file']).pipe(server);
  }

};
