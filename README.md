[![Build Status](https://travis-ci.org/chrisallenlane/clinc.svg)](https://travis-ci.org/chrisallenlane/clinc)
[![npm](https://img.shields.io/npm/v/clinc.svg)]()
[![npm](https://img.shields.io/npm/dt/clinc.svg)]()
[![Known Vulnerabilities](https://snyk.io/test/npm/clinc/badge.svg)](https://snyk.io/test/npm/clinc)


clinc
=====
A minimalist, scriptable command-line interface for GRBL v0.9.


Installation
------------
Install the package directly from npm:

```
[sudo] npm install -g clinc
```

Then seed a config file:

```
clinc config > ~/.clincrc
```


### Executables ###
The`clinc` package will install three executables on your `$PATH`:

Executable         | Purpose
-------------------|--------
`clinc-server`     | Connects to GRBL via the serialport, and displays GRBL output.
`clinc`            | Provides a user-interface for controlling GRBL via a connection to `clinc-server`.
`clinc-grbl-debug` | A debugging tool that was used while developing `clinc`. See [the wiki][wiki] for more information.


Usage
-----
Physically connect your CNC machine to your computer, and then run
`clinc-server` to open a persistent connection to GRBL. You may then use two
mechanisms for sending commands:

- `clinc send (<commands> | --file=<path>)`
- `clinc shell`

### send ###
`send` can be used to send individual commands to GRBL:

```sh
# view GRBL configuration
clinc send '$$'
```

`send` can also send entire G-code files:

```sh
#send foo.nc
clinc send --file=/path/to/foo.nc
```

Shell scripts can streamline the process of running multi-part jobs:

```sh
#!/bin/sh

# unlock the machine
clinc send '$X'

# send the first file
clinc send --file=./step-1.nc

# prompt the user for a tool change
read -p "Tool change required. Press 'Enter' when ready".

# send the second file
clinc send --file=./step-2.nc
```


### shell ###
`shell` can be used to control GRBL interactively. Any command entered into the
shell will be sent directly to GRBL. It is also possible to manually "jog" the
machine from within the shell.


#### Jog Commands ####
Use the following keypresses to jog the machine:

Keypress             | Action
---------------------|--------
`Ctrl + Left Arrow`  | Jog left
`Ctrl + Right Arrow` | Jog right
`Ctrl + Up Arrow`    | Jog backward
`Ctrl + Up Down`     | Jog forward
`PageUp`             | Raise spindle
`PageDown`           | Lower spindle
`<F1>`               | Feed hold
`Ctrl + l`           | Clear screen

The `.step` dot-command (see below) can be used to change the machine's step
distance.


#### "Dot-commands" ####
Several "dot-commands" extend the shell's functionality:

Command    | Action
-----------|------------------------------------------------------------
`.aliases` | Lists the aliases configured in `~/.clincrc`.
`.cheat`   | Displays a `clinc` cheatsheet.
`.exit`    | Exits the shell.
`.reset`   | Sends a reset instruction (`Ctrl + x`) to GRBL.
`.send`    | Sends a G-code file to GRBL. (Usage: `.send /path/to/file.nc`).
`.step`    | Sets the GRBL step distance. (Usage: `.send 0.5`).

Note that `.help` will reveal other available dot-commands (including `.help`
itself). These are built in to [node's REPL object][repl] (upon which `clinc
shell` is built). They are of no value to `clinc` users, and should be ignored.


Configuring
-----------
`clinc` is configured in `~/.clincrc`, and relies on [rc][] for
configuration management under-the-hood. The following is an example
`./clincrc` file:

```json
{
  "aliases" : {
    "check mode"   : "$C",
    "cycle start"  : "~",
    "hold"         : "!",
    "homing cycle" : "$H",
    "inches"       : "G20",
    "metric"       : "G21",
    "reset zero"   : "G28.1",
    "resume"       : "~",
    "settings"     : "$$",
    "unlock"       : "$X",
    "view build"   : "$I",
    "view startup" : "$N",
    "view state"   : "$G",
    "zero"         : "G28"
  },

  "server" : {
    "baudRate"   : 115200,
    "serverPort" : 9283,
    "serialPort" : "/dev/ttyACM0"
  }
}
```

The configuration provides a mechanism for command aliases, and allows
specification of `clinc-server` connection parameters.


### Aliases ###
"Aliases" are G-code and GRBL-command shorthands. When an alias is entered into
the shell (ex: `inches`), its corresponding value (ex: `G20`) is executed in
its place.

Aliases can be used to implement brief "macros", and are entirely
user-configurable. There are no hard-coded command aliases.

Aliases will be respected by both `clinc shell` and `clinc send`.


### Server Connection Parameters ###
The config's `server` property defines GRBL and `clinc-server` connection
parameters.

Property            | Purpose
--------------------|--------------------------------------------------------
`server.baudRate`   | The GRBL connection baudrate.
`server.serverPort` | The port that `clinc` and `clinc-server` should use for communication. May be any valid port.
`server.serialPort` | The path to the serial-port interface. **You will likely need to change this to the value that's appropriate for your system.**

[rc]: https://www.npmjs.com/package/rc
[repl]: https://nodejs.org/api/repl.html
[wiki]: https://github.com/chrisallenlane/clinc/wiki
