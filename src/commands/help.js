const CHANNEL_TYPES = require("../constants/channelTypes");

module.exports = {
    name: "help",
    aliases: ["?"],

    execute({ session }) {
        const chatService = session.chatService;
        const commandService = session.commandService;

        const commandNames = Array.from(commandService.commands.values())
            .filter((command, index, commands) => commands.indexOf(command) === index)
            .map((command) => `/${command.name}`)
            .sort((left, right) => left.localeCompare(right));

        chatService.sendBroadcastGlobalMessage(
            `Available commands: ${commandNames.join(", ")}`,
            { channelIndex: CHANNEL_TYPES.SERVER_MESSAGE }
        );
    }
};