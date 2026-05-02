const MESSAGE_IDS = require("../../constants/messageIds");

module.exports = function registerRemoveItemFromInventoryHandler(connection) {
    connection.on(`server:${MESSAGE_IDS.REMOVE_ITEM_FROM_INVENTORY}`, (message) => {
        const inventory = connection.session.inventory;
        const removedItem = message.rI;

        if (!removedItem) {
            return;
        }

        inventory.removeItem(
            removedItem.BlockType,
            removedItem.InventoryType,
            removedItem.Amount
        );
    });
};