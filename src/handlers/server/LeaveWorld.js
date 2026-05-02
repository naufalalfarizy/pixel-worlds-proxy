const MESSAGE_IDS = require("../../constants/messageIds");

module.exports = function registerLeaveWorldHandler(connection) {
    connection.on(`server:${MESSAGE_IDS.LEAVE_WORLD}`, (message) => {
        const session = connection.session;
        const world = session.world;

        world.reset();
    });
};