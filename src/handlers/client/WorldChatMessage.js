const MESSAGE_IDS = require("../../constants/messageIds");

module.exports = function registerWorldChatMessageHandler(connection) {
    connection.on(`client:${MESSAGE_IDS.WORLD_CHAT_MESSAGE}`, (message, cancelMessage) => {
        const session = connection.session;
        const commandService = session.commandService;

        const chatText = message.msg;

        if (typeof chatText !== "string") {
            return;
        }

        if (!chatText.startsWith("/")) {
            return;
        }

        const isHandled = commandService.execute(chatText);

        if (isHandled) {
            cancelMessage();
        }
    });
};