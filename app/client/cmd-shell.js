const Rcmds  = require('./shell-util-repl-commands');
const alias  = require('./shell-util-alias');
const chalk  = require('chalk');
const manual = require('./shell-util-manual');
const net    = require('net');
const repl   = require('repl');

module.exports = function(options, config) {

  // track machine state
  const state = {
    step : 1,
  };

  // connect to the GRBL server
  const server = net.createConnection({ port: config.server.serverPort });

  // notify the user if a connection to the server cannot be established
  server.on('error', function(err) {
    console.warn(chalk.red('Cannot connect to clinc-server. ' + err.message));
    process.exit(1);
  });
  
  // notify the user if the connection to the server is lost
  server.on('close', function() {
    console.warn(chalk.red('Lost connection to clinc-server.'));
    process.exit(1);
  });

  // implement the evaluation loop
  const loop = function(cmd, context, filename, callback) {

    // store the original command
    const orig = cmd.trim();

    // apply aliases
    cmd = alias(config, cmd.trim());

    // write the command to the server
    server.write(cmd + '\n');

    // if an alias was applied, display the gcode that was sent
    if (cmd !== orig) {
      return callback(null, 'Aliased: ' + cmd);
    }

    // otherwise, display nothing
    callback();
  };
  
  // start the REPL and create a handle to the context
  const replServer = repl.start({
    prompt : 'grbl> ',
    eval   : loop,
  });

  // close the connection to the server on REPL exit
  replServer.on('exit', function() {
    server.destroy();
    process.exit();
  });
  
  // process info messages (from "dot-commands")
  replServer.on('info', function(msg) {
    console.log(msg);
    replServer.displayPrompt();
  });

  // process manual events
  replServer.on('manual', function(gcode) {
    server.write(gcode + '\n');
  });
  
  // process feed-hold events
  replServer.on('hold', function(gcode) {
    server.write(gcode + '\n');
  });

  // define repl dot-commands
  const rcmds = Rcmds(config, state);
  replServer.defineCommand('aliases' , rcmds.aliases);
  replServer.defineCommand('cheat'   , rcmds.cheat);
  replServer.defineCommand('reset'   , rcmds.reset);
  replServer.defineCommand('send'    , rcmds.send);
  replServer.defineCommand('step'    , rcmds.step);

  // listen for keypresses (manual machine control)
  process.stdin.on('keypress', function(key, info) {
    manual(info, state, replServer);
  });

};
