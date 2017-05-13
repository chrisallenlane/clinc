const chalk  = require('chalk');
const cheat  = require('./shell-util-cheat');
const fs     = require('fs');
const lodash = require('lodash');
const net    = require('net');
const table  = require('text-table');

module.exports = function(config, state) {

  // container of repl dot-commands
  const commands = {};
  
  // aliases
  commands.aliases = {
    help   : 'Displays configured aliases',
    action : function(input) {

      // restructure keys/vals into nested arrays
      const rows = Object.keys(config.aliases || {}).map(function(key) {
        return [ key, config.aliases[key] ];
      });

      // notify the user if no aliases are set
      if (lodash.isEmpty(rows)) {
        this.emit('info', chalk.green('No aliases are configured.'));
        return;
      }

      // otherwise, display the aliases
      this.emit('info', chalk.green(table(rows)));
    },
  };

  // cheat
  commands.cheat = {
    help   : 'Displays a cheatsheet',
    action : function(input) {
      this.emit('info', cheat());
    },
  };

  // reset
  commands.reset = {
    help   : 'Soft-reset GRBL (ctrl-x)',
    action : function(input) {
      this.emit('manual', '\030');
      this.emit('info', chalk.yellow('Reset instruction sent to GRBL.'));
    },
  };
  
  // send
  commands.send = {
    help   : 'Sends a file to GRBL',
    action : function(input) {

      if (!input) {
        const msg = 'File unspecified.\nExample: .send /path/to/file.nc';
        this.emit('info', chalk.red(msg));
        return;
      }

      // attempt to send the user-specified file to GRBL
      try {
        /** 
         * NB: It is necessary to create a new connection to the server here.
         * If we don't do this, real-time commands won't reach GRBL in a timely
         * fashion, because back-pressure from the Planner stream will prevent
         * them from being processed.
         */
        const fileserver = net.createConnection({
          port: config.server.serverPort 
        });

        /**
         * NB: don't use fs.createReadStream() and pipe() here, because those
         * errors will not be trapped by `catch`. 
         */
        fileserver.write(fs.readFileSync(input) + '\n', function() {
          fileserver.destroy();
        });
        this.emit('info', chalk.green(input + ' sent to GRBL.'));
      }
      
      catch (err) {
        this.emit(
          'info',
          chalk.red('Cannot send file ' + input + '. ' + err.message)
        );
      }
    },
  };

  // step
  commands.step = {
    help   : 'Sets the step value',
    action : function(input) {

      // assert that input is valid
      if (!input || isNaN(input)) {
        const msg = 'Step value must be a number.\nExample: .step 0.5';
        this.emit('info', chalk.red(msg));
        return;
      }

      state.step = Number(input);
      this.emit('info', chalk.green('Step value changed to ' + input + '.'));
    },
  };

  // return the commands object
  return commands;

};
