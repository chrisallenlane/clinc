const chalk  = require('chalk');
const stream = require('stream');

module.exports = function(colorize, output) {

  // NB: this allows for cleaner unit-testing
  output = output || console;

  const logger = new stream.Writable({ objectMode: true });

  logger._write = function (obj, enc, callback) {

    // stringify the JSON output
    var logline = JSON.stringify(obj);

    // optionally apply colorization
    if (colorize) {

      // make obj.command white
      obj.command = chalk.white(obj.command);

      // choose the color for obj.response depending on its value
      const color =
        (obj.response === 'ok')        ? 'green' :
        (obj.response.match(/^error/)) ? 'red'   :
        (obj.response.match(/^\$/))    ? 'cyan'  : 'yellow';
      obj.response = chalk[color](obj.response);

      // manually concatenate the JSON output
      logline = [
        chalk.gray('{"command":"'),
        obj.command,
        chalk.gray('","response":"'),
        obj.response,
        chalk.gray('"}'),
      ].join('');
    }

    // log the output
    output.log(logline);
    callback();
  };

  return logger;
};
