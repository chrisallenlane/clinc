const chalk = require('chalk');

module.exports = function() {

  // assemble the cheatsheet
  var cheatsheet = '';
  var url        = '';

  // manual controls
  cheatsheet += chalk.cyan('Manual Controls\n');
  cheatsheet += [
    'Left         Ctrl + Left Arrow',
    'Right        Ctrl + Right Arrow',
    'Forward      Ctrl + Up Arrow',
    'Backard      Ctrl + Down Arrow',
    'Up           PageUp',
    'Down         PageDown',
    'Feed Hold    <F1>',
  ].join('\n');

  // dot-commands
  cheatsheet += '\n\n';
  cheatsheet += chalk.green('Dot-commands\n');
  cheatsheet += [
    '.aliases     View user-defined command aliases',
    '.cheat       View this cheatsheet',
    '.reset       Reset GRBL (ctrl+x)',
    '.send        Send a file to GRBL. (Ex: .send /path/to/file.nc)',
    '.step        Change the step distance. (Ex: .step 0.5)',
  ].join('\n');

  // GRBL commands
  url         = 'https://github.com/grbl/grbl/wiki/Interfacing-with-Grbl';
  cheatsheet += '\n\n';
  cheatsheet += [
    chalk.yellow('GRBL Commands'),
   '(' + chalk.underline.blue(url) + ')\n'
  ].join(' ');
    
  cheatsheet += [
    '$$           View Grbl settings',
    '$#           View # parameters',
    '$G           View parser state',
    '$I           View build info',
    '$N           View startup blocks',
    '$x=value     Save Grbl setting',
    '$Nx=line     Save startup block',
    '$C           Check G-code mode',
    '$X           Kill alarm lock',
    '$H           Run homing cycle',
    '~            Cycle start',
    '!            Feed hold',
    '?            Current status',
    'ctrl-x       Reset Grbl',
  ].join('\n');

  // G-code Reference
  url         = 'http://www.shapeoko.com/wiki/index.php/G-Code';
  cheatsheet += '\n\n';
  cheatsheet += [
    chalk.red('G-code Reference'),
   '(' + chalk.underline.blue(url) + ')\n'
  ].join(' ');

  cheatsheet += [
    'G0           Rapid positioning',
    'G1           Linear interpolation',
    'G10          Set Work Coordinate Origin',
    'G20          Set units to inches',
    'G21          Set units to mm',
    'G90          Switch to absolute distance mode',
    'G91          Switch to incremental distance mode',
    'F            Defines feed rate',
    'M2           Program Pause and End',
  ].join('\n');

  // return the cheatsheet
  return cheatsheet;
};
