
Veikkaus’ Elite-S Betting Terminal Transaction Interface for Cash Registers
=============================================================================

This repository contains resources for cash register system providers and/or developers who are integrating
with Veikkaus Elite-S betting terminals.


Protocol
-----------------------------------------------------------------------------

Find the protocol specification of the interface between cash registers and Elite-S terminals
in the file [docs/protocol.md].

[docs/protocol.md]: docs/protocol.md


Simulator
-----------------------------------------------------------------------------

The Oiva simulator is a program that can simulate the Veikkaus Elite-S betting terminal by sending messages
to a serial port.

In order to use the simulator, first install the version of Node.js specified in `.nvmrc`.
[nvm] is a convenient way to do this:

    nvm install

If using MacOs with M1 chip, before `npm install`, you need to install some dependecies. Example use brew (https://brew.sh/):

    brew install pkg-config cairo pango libpng jpeg giflib librsvg

Then install the `npm` dependencies:

    npm install

[nvm]: https://github.com/nvm-sh/nvm

The executable file `oiva-simulator.js` implements the command-line interface to the simulator. Run it without any
arguments to see the usage instructions.


---

_Copyright © Veikkaus Oy_
