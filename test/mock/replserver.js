const events = require('events');

module.exports = function() {

  const replServer = new events.EventEmitter();

  replServer.keyword = '';
  replServer.help    = '';
  replServer.action  = function() {};

  replServer.defineCommand = function(keyword, definition) {
    replServer.keyword = keyword;
    replServer.help    = definition.help;
    replServer.action  = definition.action;
  };

  return replServer;
};
