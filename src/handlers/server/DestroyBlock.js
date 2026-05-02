const MESSAGE_IDS = require("../../constants/messageIds");

module.exports = function registerDestroyBlockHandler(connection) {
    connection.on(`server:${MESSAGE_IDS.DESTROY_BLOCK}`, (message) => {
        const session = connection.session;
        const world = session.world;

        const tile = world.getTile(message.x, message.y);
        if (!tile) {
            return;
        }

        if (tile.block === message.DBBT) {
            tile.block = 0;
        } else if (tile.background === message.DBBT) {
            tile.background = 0;
        } else if (tile.water === message.DBBT) {
            tile.water = 0;
        } else if (tile.wiring === message.DBBT) {
            tile.wiring = 0;
        }
    });
};