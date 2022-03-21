
Veikkaus’ Elite-S Betting Terminal Transaction Interface for Cash Registers
===============================================================================

**Intended audience:**

Cash register system providers / developers

**Contacts:**

- Veikkaus’ Betting Terminal Development Team (email: `muu` at `veikkaus.fi`)
- Tuomas Huuskonen (email: firstname dot lastname at `veikkaus.fi`)
- Esamatti Liuhala (email: firstname dot lastname at `veikkaus.fi`)


Introduction
-------------------------------------------------------------------------------

This document describes how to connect Veikkaus’ Elite-S betting terminal to a retailer’s cash register.

The data link between the betting terminal and the cash register is used to synchronize betting transactions between Veikkaus’ gaming systems and the agent’s POS systems without manual actions on the cash register. It is thus intended to reduce discrepancies between Veikkaus invoicing and the agent’s bookkeeping.

The first versions of this betting transaction interface were originally built into Veikkaus’ old “Altura” terminals. Alongside these, Veikkaus has operated old Fintoto’s “Wave” horse gaming terminals, which have their own method and protocol for providing transaction data to agents’ POS systems.

Veikkaus’ Elite-S betting terminal will provide the betting transaction interface described in this document. The protocol used in the interface includes some new transaction types, game types, and indexes.

In the future, Veikkaus aims to provide a server-based service for synchronizing gaming transactions between Veikkaus gaming systems and agents’ POS systems. The plan is to start developing this new type of service no later than after the new terminal rollout.


Asynchronous Serial Communication between Terminal and Cash Register
-------------------------------------------------------------------------------

Asynchronous serial communication is used for the transmission of data. The Elite-S retailer terminals will come equipped with serial ports complying with the RS-232 standard.

There is no multipoint capability for a single connection.


### Cables

DE-9 cables will be used for data transfer.

Serial port connectors mounted on terminal are male. Most serial port connectors mounted on cash registers are also male.

Veikkaus´ Elite-S betting terminal connector is type D-9 female. PC end connector is usually D-9 female for serial port. Signal wires must ‘cross connected’. 
Cable connections are: 
D-9  D9 
2 3 
3 2 
4 4 
5 5 
6 6

Communication Protocol
-------------------------------------------------------------------------------

The betting terminal transmits messages that the cash register reads. Messages from the terminal do not need to be acknowledged.

- Messages are ASCII strings
- Messages start with a colon character (`:`)
- Fields within the message are separated by semicolon characters (`;`)
- Messages are terminated by carriage return and line feed characters (`\r\n`)

Connection configuration in asynchronous mode (a serial port parameter setting):

    19200/8-N-1

- Baud rate: 19200 bps
- eight (8) data bits
- no (N) parity bit
- one (1) stop bit


Message Structures
-------------------------------------------------------------------------------

Each message sent by the terminal follows the structure described in the previous chapter. This chapter specifies the fields included in different kinds of messages, as well as their formats and allowed values. The fields are listed in the order in which they appear in the messages.

In order to see some examples of serialized messages, please refer to the messages included in the _Oiva simulator_ (in the same Git repository as this document).


### Common Formats

#### Timestamps

Times are given in the format `HHmmss` (hours, minutes, seconds).

Example: `170957` for 17:09:57, that is, nine minutes and 57 seconds past five p.m.

#### Currency Amounts

Monetary amounts are formatted:

- as a floating point number
- using `.` as the decimal separator
- with a leading sign (`+` for sales, `-` for cashing, cancellations, and refunds)
- followed by leading padding zeroes, as required in order to reach a total character length of 10

Example: `+000107.08` for 107 Euros and 8 cents.


### Wager sales, Cashing (validations), Refunds, Cancellations

- **RecId** (length: 2) — Record type identifier
    - `02`: Sell wager
    - `03`: Cancel wager
    - `04`: Cash or refund
    - `05`: Sell shared ticket wager
- **TransTime** (length: 6) — Transaction time _(see “Common Formats”)_
- **GameType** (length: 2) — Game type identifier _(see “Field Values”)_
- **GameIndex** (length: 2) — Game index identifier _(see “Field Values”)_
- **SideGameType** (length: 2) — Side game type identifier _(see “Field Values”)_
- **SideGameIndex** (length: 2) — Side game index identifier _(see “Field Values”)_
- **TransAmount** (length: 10) — Transaction amount _(see “Common Formats/Currency Amounts”)_
- **TicketId** (length: 13–21) — Ticket identifier; the barcode data of the associated ticket
- **NumShares** (length: 1–3) — Number of shares as an integer (note: not padded)
- **ShareId{1…100}** (length: per share: same as `TicketId` above) — Share ticket identifier (see `TicketId` above) — this field is repeated for each share included in the transaction, and omitted entirely if there are none


### Emptying Shopping Cart (“End Session and Transfer transactions to cash register”)

- **RecId** (length: 2) — Record type identifier
    - `10`: Customer session end
- **TransTime** (length: 6) — Transaction time _(see “Common Formats”)_
- **TotalAmount** (length: 10) — Customer session balance _(see “Common Formats/Currency Amounts”)_
- **NumTrans** (length: 4) — Number of transactions (zero-padded, e.g. `0004`)


### Field Values

#### Game Types

- `00`: Unknown type or no type.
- `01`: Lotto
- `02`: Vakio
- `04`: Jokeri
- `05`: Superkaksari
- `06`: Tulosveto
- `07`: Voittajaveto
- `11`: Moniveto
- `13`: Päivän Pari
- `14`: Supertripla
- `15`: Päivän Trio
- `18`: Keno
- `22`: Eurojackpot
- `27`: Lomatonni
- `28`: Pitkäveto
- `30`: Kaikki tai ei mitään
- `31`: Synttärit
- `33`: TOTO (Horse Games)
- `34`: Vikinglotto

#### Game Indices

- `51`: Not in use

#### Side Game Types

- `51`: Not in use
- `07`: With wager sale, if Jokeri is included
- `08`: With wager sale, if Lomatonni is included
- `09`: With wager sale, if both Jokeri and Lomatonni are included

#### Side Game Indices

- `51`: Not in use













