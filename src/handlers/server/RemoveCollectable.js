const MESSAGE_IDS = require("../../constants/messageIds");

module.exports = function registerRemoveCollectableHandler(connection) {
    connection.on(`server:${MESSAGE_IDS.REMOVE_COLLECTABLE}`, (message) => {
        const world = connection.session.world;
        const collectableID = message.CollectableID;

        world.removeCollectable(
            (collectable) => collectable.collectableID === collectableID
        );
    });
};