const MESSAGE_IDS = require("../../constants/messageIds");

module.exports = function registerCollectHandler(connection) {
    connection.on(`server:${MESSAGE_IDS.COLLECT}`, (message) => {
        const session = connection.session;
        const world = session.world;
        const inventory = session.inventory;
        const localPlayerData = session.localPlayerData;

        world.removeCollectable((collectable) => {
            return collectable.collectableID === message.CollectableID;
        });

        if (message.IsGem) {
            localPlayerData.gems += message.Amount;
        }

        inventory.addItem(
            message.BlockType,
            message.InventoryType,
            message.Amount
        );
    });
};