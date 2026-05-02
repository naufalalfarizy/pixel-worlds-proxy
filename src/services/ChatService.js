const CHANNEL_TYPES = require("../constants/channelTypes");

class ChatService {
    constructor(session) {
        this.session = session;
    }

    sendBroadcastGlobalMessage(text, options = {}) {
        const {
            nick = "",
            userID = "",
            channel = "",
            channelIndex = CHANNEL_TYPES.GLOBAL,
            time = new Date()
        } = options;

        this.session.connection.queueIncomingMessage({
            ID: "BGM",
            CmB: {
                nick,
                userID,
                channel,
                channelIndex,
                message: text,
                time: new Date()
            }
        });
    }
}

module.exports = ChatService;