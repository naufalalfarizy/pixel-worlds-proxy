# Pixel Worlds Proxy

A modular Node.js TCP proxy for Pixel Worlds traffic. It sits between the game client and an upstream Pixel Worlds-compatible server, decodes BSON-framed packets, routes messages through client/server handlers, tracks local session state, and supports in-game slash commands.

## Features

- TCP proxy server built with Node.js `net`
- BSON packet serialization/deserialization with length-prefixed framing
- Client-to-server and server-to-client message interception
- Pluggable handler system for game messages
- Redirect routing for server handoffs via `OoIP` messages
- Session state for world tiles, collectables, players, local player data, and inventory
- Inventory serialization/deserialization helpers
- Zstandard-compressed world BSON loading
- Built-in slash command loader with `/help` command
- Configurable upstream/proxy host, port, redirect TTL, and debug logging through environment variables

## Project structure

```text
src/
├── commands/              # Slash commands, such as /help
├── config/                # Environment-based configuration
├── constants/             # Message IDs, channel types, item types, layers, etc.
├── core/                  # Packet stream, proxy connection, upstream router
├── data/csv/              # Block type metadata
├── game/                  # Session state and game models
├── handlers/
│   ├── client/            # Client message handlers
│   └── server/            # Server message handlers
├── services/              # Chat, commands, inventory, and world services
└── index.js               # Application entry point
```

## Installation

```bash
git clone https://github.com/your-username/pixel-worlds-proxy.git
cd pixel-worlds-proxy
npm install
```

## Configuration

Create a `.env` file in the project root:

```env
UPSTREAM_HOST=<pixel-worlds-ip>
UPSTREAM_PORT=10001

PROXY_HOST=127.0.0.1
PROXY_PORT=10001

REDIRECT_HOST=<pixel-worlds-hostname>
REDIRECT_TTL_MS=15000

DEBUG_CLIENT_MESSAGES=false
DEBUG_SERVER_MESSAGES=false
```

### Environment variables

| Variable | Description |
| --- | --- |
| `UPSTREAM_HOST` | Pixel Worlds upstream server IP address. |
| `UPSTREAM_PORT` | Pixel Worlds server port, usually `10001`. |
| `PROXY_HOST` | Local host/interface the proxy listens on. |
| `PROXY_PORT` | Local port the proxy listens on. |
| `REDIRECT_HOST` | Pixel Worlds host name sent back to the client when redirect messages are rewritten. |
| `REDIRECT_TTL_MS` | How long pending upstream redirects stay valid. |
| `DEBUG_CLIENT_MESSAGES` | Set to `true` to log decoded client messages. |
| `DEBUG_SERVER_MESSAGES` | Set to `true` to log decoded server messages. |

## Running the proxy

```bash
npm test
```

The current `package.json` runs `node .`, which starts `src/index.js` through the package `main` field.

When the proxy starts successfully, you should see output similar to:

```text
Listening on 127.0.0.1:10001
```

Point your client or local test setup at `PROXY_HOST:PROXY_PORT`. The proxy will forward traffic to the Pixel Worlds upstream server configured as `UPSTREAM_HOST:UPSTREAM_PORT`.

## How it works

1. `src/index.js` loads block metadata and starts the TCP proxy server.
2. Each client connection creates a `ProxyConnection`.
3. `PacketStream` reads length-prefixed BSON packets from each socket.
4. Packets are converted into message arrays using the `mc`, `m0`, `m1`, ... structure.
5. Messages are emitted as events such as `client:WCM` or `server:GWC`.
6. Registered handlers can inspect, update, queue, or cancel messages.
7. Messages are serialized back into BSON packets and forwarded to the other side.

## Supported message handling

The project currently includes handlers for:

- World chat commands
- Player data loading
- World loading from compressed BSON
- Block, background, water, and seed placement
- Block destruction
- Collectable creation/removal/collection
- Inventory item removal
- Network player joins/leaves
- World leave/reset events
- Server redirect handling

Message IDs are centralized in `src/constants/messageIds.js`.

## Commands

Commands live in `src/commands`. The included command is:

```text
/help
/?
```

It sends a server-message style chat response listing available commands.

### Adding a command

Create a new file in `src/commands`, for example `ping.js`:

```js
module.exports = {
    name: "ping",
    aliases: ["p"],

    execute({ session, args }) {
        session.chatService.sendBroadcastGlobalMessage("Pong!");
    }
};
```

Then type `/ping` in chat. If the command is handled, the original chat message is canceled before it reaches the upstream server.

## Adding a message handler

Client handlers go in `src/handlers/client`; server handlers go in `src/handlers/server`.

Example server handler:

```js
const MESSAGE_IDS = require("../../constants/messageIds");

module.exports = function registerExampleHandler(connection) {
    connection.on(`server:${MESSAGE_IDS.GET_PLAYER_DATA}`, (message) => {
        console.log("Loaded player:", message.UN);
    });
};
```

Handlers are loaded automatically from their folders, excluding `index.js`.

## Core modules

### `PacketStream`

Handles packet framing and BSON serialization/deserialization.

### `ProxyConnection`

Owns one client socket and one upstream socket. It processes messages in both directions, emits handler events, supports message cancellation, and manages cleanup.

### `UpstreamRouter`

Stores short-lived redirect targets per client so reconnects can be routed to the correct upstream server.

### `Session`

Holds state for the current connection, including:

- Local player data
- Inventory
- World tiles
- Collectables
- Players
- Chat, command, world, and inventory services

## Development notes

- Keep message IDs in `src/constants/messageIds.js` rather than hard-coding them in handlers.
- Prefer adding small single-purpose handlers instead of large combined handlers.
- Enable debug logging only when needed, because packet logs can be noisy.

## License

This project is licensed under the MIT License.
