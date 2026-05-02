const MESSAGE_IDS = require("../../constants/messageIds");

module.exports = function registerNewCollectableHandler(connection) {
    connection.on(`server:${MESSAGE_IDS.NEW_COLLECTABLE}`, (message) => {
        const world = connection.session.world;

        world.addCollectable({
            collectableID: message.CollectableID,
            blockType: message.BlockType,
            amount: message.Amount,
            inventoryType: message.InventoryType,
            posX: message.PosX,
            posY: message.PosY,
            isGem: message.IsGem,
            gemType: message.GemType
        });
    });
};