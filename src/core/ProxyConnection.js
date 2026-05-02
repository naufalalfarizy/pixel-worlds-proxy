const { EventEmitter } = require("node:events");
const net = require("node:net");

const config = require("../config");
const PacketStream = require("./PacketStream");
const Session = require("../game/Session");
const ChatService = require("../services/ChatService");
const CommandService = require("../services/CommandService");

const registerClientHandlers = require("../handlers/client");
const registerServerHandlers = require("../handlers/server");

class ProxyConnection extends EventEmitter {
    constructor(clientSocket, configData, options = {}) {
        super();

        this._isDestroyed = false;

        this.upstreamHost = options.host ?? config.upstream.host;
        this.upstreamPort = options.port ?? config.upstream.port;

        this.clientStream = new PacketStream(clientSocket);

        this.serverSocket = net.createConnection({
            host: this.upstreamHost,
            port: this.upstreamPort
        });

        this.serverStream = new PacketStream(this.serverSocket);

        this.session = new Session(this, configData);

        this.clientMessageQueue = [];
        this.serverMessageQueue = [];

        this.bindEvents();

        registerClientHandlers(this);
        registerServerHandlers(this);
    }

    queueOutgoingMessage(message) {
        this.clientMessageQueue.push(message);
    }

    queueIncomingMessage(message) {
        this.serverMessageQueue.push(message);
    }

    bindEvents() {
        this.clientStream.on("data", (packet) => {
            const messages = this.getPacketMessages(packet);

            if (config.debug.clientMessages && messages.length > 0) {
                console.log("Client:", messages);
            }

            this.processMessages("client", messages);

            if (this.clientMessageQueue.length > 0) {
                messages.push(...this.clientMessageQueue);
                this.clientMessageQueue.length = 0;
            }

            this.serverStream.sendMessages(messages);
        });

        this.serverStream.on("data", (packet) => {
            const messages = this.getPacketMessages(packet);

            if (config.debug.serverMessages && messages.length > 0) {
                console.log("Server:", messages);
            }

            this.processMessages("server", messages);

            if (this.serverMessageQueue.length > 0) {
                messages.push(...this.serverMessageQueue);
                this.serverMessageQueue.length = 0;
            }

            this.clientStream.sendMessages(messages);
        });

        const handleCleanup = () => this.cleanup();

        this.clientStream.on("error", (error) => {
            this.emit("error", error);
            handleCleanup();
        });

        this.serverStream.on("error", (error) => {
            this.emit("error", error);
            handleCleanup();
        });

        this.clientStream.on("close", handleCleanup);
        this.serverStream.on("close", handleCleanup);
    }

    processMessages(direction, messages) {
        for (let index = 0; index < messages.length;) {
            const message = messages[index];

            if (!message || typeof message !== "object" || !message.ID) {
                index++;
                continue;
            }

            const eventName = `${direction}:${message.ID}`;
            let isCanceled = false;

            try {
                this.emit(eventName, message, () => {
                    isCanceled = true;
                });
            } catch (error) {
                this.emit("error", error);
            }

            if (isCanceled) {
                messages.splice(index, 1);
                continue;
            }

            index++;
        }
    }

    getPacketMessages(packet) {
        if (!packet || typeof packet !== "object") {
            return [];
        }

        if (!Object.prototype.hasOwnProperty.call(packet, "mc")) {
            return [];
        }

        const messageCount = Number(packet.mc);
        if (!Number.isInteger(messageCount) || messageCount < 0) {
            return [];
        }

        const messages = [];
        for (let index = 0; index < messageCount; index++) {
            messages.push(packet[`m${index}`]);
        }

        return messages;
    }

    cleanup() {
        if (this._isDestroyed) {
            return;
        }

        this._isDestroyed = true;

        this.clientStream.destroy();
        this.serverStream.destroy();

        this.emit("close");
        this.removeAllListeners();
    }
}

module.exports = ProxyConnection;