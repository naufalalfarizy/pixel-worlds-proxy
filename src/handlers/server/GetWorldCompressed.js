const MESSAGE_IDS = require("../../constants/messageIds");

module.exports = function registerGetWorldCompressedHandler(connection) {
    connection.on(`server:${MESSAGE_IDS.GET_WORLD_COMPRESSED}`, (message) => {
        const session = connection.session;
        const worldService = session.worldService;
        const world = session.world;

        const worldData = worldService.deserializeWorld(message.W.buffer);
        if (!worldData) {
            return;
        }

        const sizeX = worldData.WorldSizeSettingsType.WorldSizeX;
        const sizeY = worldData.WorldSizeSettingsType.WorldSizeY;

        world.initialize(sizeX, sizeY);

        worldService.loadTiles(worldData, sizeX, sizeY);
        worldService.loadCollectables(worldData.Collectables);
    });
};