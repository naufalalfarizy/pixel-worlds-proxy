const MESSAGE_IDS = require("../../constants/messageIds");

module.exports = function registerPlayerLeftHandler(connection) {
    connection.on(`server:${MESSAGE_IDS.PLAYER_LEFT}`, (message) => {
        const session = connection.session;
        const world = session.world;

        world.removePlayer(message.U);
    });
};