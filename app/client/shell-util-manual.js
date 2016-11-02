const chalk = require('chalk');

const jog = function(state, axis, direction) {
  return 'G91 G0 ' + axis + (state.step * direction);
};

// responds to key presses in real-time
module.exports = function(info, state, replServer) {

  // feed hold
  if (info && info.name === 'f1') {
    const msg = chalk.gray('<F1>') + '\n' + chalk.yellow('Feed hold sent.');
    replServer.emit('hold', '!');
    replServer.emit('info', msg);
  }

  // X-axis
  if (info && info.name === 'left' && info.ctrl === true) {
    replServer.emit('manual', jog(state, 'X', -1));
  }
  if (info && info.name === 'right' && info.ctrl === true) {
    replServer.emit('manual', jog(state, 'X', 1));
  }

  // Y-axis
  if (info && info.name === 'up' && info.ctrl === true) {
    replServer.emit('manual', jog(state, 'Y', 1));
  }
  if (info && info.name === 'down' && info.ctrl === true) {
    replServer.emit('manual', jog(state, 'Y', -1));
  }

  // Z-axis
  //
  // NB: It doesn't seem possible to detect Ctrl + page{up,down}.
  // I don't know why. Maybe the terminal is eating it.
  //
  if (info && info.name === 'pageup') {
    replServer.emit('manual', jog(state, 'Z', 1));
  }
  if (info && info.name === 'pagedown') {
    replServer.emit('manual', jog(state, 'Z', -1));
  }

};
