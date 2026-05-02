const { BSON } = require("bson");
const { Buffer } = require("buffer");
const { EventEmitter } = require("events");

class PacketStream extends EventEmitter {
    constructor(socket) {
        super();

        this.socket = socket;
        this.buffer = Buffer.alloc(0);

        socket.on("data", this.handleSocketData.bind(this));
        socket.on("close", () => this.emit("close"));
        socket.on("error", (error) => this.emit("error", error));
    }

    handleSocketData(chunk) {
        this.buffer = Buffer.concat([this.buffer, chunk]);

        while (this.buffer.length >= 4) {
            const packetLength = this.buffer.readUInt32LE(0);

            if (this.buffer.length < packetLength) {
                break;
            }

            let packet;
            try {
                packet = BSON.deserialize(this.buffer.slice(4, packetLength));
                this.emit("data", packet);
            } catch (error) {
                this.emit("error", error);
            }

            this.buffer = this.buffer.slice(packetLength);
        }
    }

    sendPacket(packet) {
        const serializedPacket = BSON.serialize(packet);
        const framedPacket = Buffer.allocUnsafe(4 + serializedPacket.length);

        framedPacket.writeUInt32LE(4 + serializedPacket.length, 0);
        serializedPacket.copy(framedPacket, 4);

        this.socket.write(framedPacket);
    }

    sendMessages(messages) {
        if (!Array.isArray(messages)) {
            throw new TypeError("sendMessages(messages) requires an array");
        }

        const packet = { mc: messages.length };

        for (let index = 0; index < messages.length; index++) {
            packet[`m${index}`] = messages[index];
        }

        this.sendPacket(packet);
    }

    destroy() {
        this.socket.destroy();
    }
}

module.exports = PacketStream;