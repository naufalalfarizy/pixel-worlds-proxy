const INVENTORY_ITEM_TYPES = require("../../constants/inventoryItemTypes");
const MESSAGE_IDS = require("../../constants/messageIds");

module.exports = function registerSetBlockHandler(connection) {
    connection.on(`server:${MESSAGE_IDS.SET_BLOCK}`, (message) => {
        const session = connection.session;
        const inventory = session.inventory;
        const world = session.world;

        const tile = world.getTile(message.x, message.y);
        if (!tile) {
            return;
        }

        tile.block = message.BlockType;

        const localPlayerID = session.localPlayerData?.userID;
        if (message.U === localPlayerID) {
            inventory.removeItem(message.BlockType, INVENTORY_ITEM_TYPES.BLOCK, 1);
        }
    });
};