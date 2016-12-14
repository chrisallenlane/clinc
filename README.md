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

You may need to change the default `server.serialPort` path in `~/.clincrc`. To
see a list of available serialports, run:

```sh
clinc-server list
```

See [the wiki][conf] for an in-depth guide to configuration.

### Executables ###
The`clinc` package will install three executables on your `$PATH`:

Executable         | Purpose
-------------------|--------
`clinc-server`     | Connects to GRBL via the serialport, and displays GRBL output.
`clinc`            | Provides a user-interface for controlling GRBL via a connection to `clinc-server`.
`clinc-grbl-debug` | A debugging tool that was used while developing `clinc`. See [the wiki][wiki] for more information.


Usage
-----
Physically connect your CNC machine to your computer, then connect to GRBL
with:

```sh
clinc-server -c
```

Note that `$USER` must have access to the serialport, or `clinc-server` will
fail with an error. On Debian-based systems, it may be necessary to add `$USER`
to the `dialout` group. 

You may then use these two commands for sending G-code to `clinc-server`:

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

[conf]: https://github.com/chrisallenlane/clinc/wiki/Configuring
[repl]: https://nodejs.org/api/repl.html
[wiki]: https://github.com/chrisallenlane/clinc/wiki
