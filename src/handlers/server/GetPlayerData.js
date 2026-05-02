const { BSON } = require("bson");
const MESSAGE_IDS = require("../../constants/messageIds");

module.exports = function registerGetPlayerDataHandler(connection) {
    connection.on(`server:${MESSAGE_IDS.GET_PLAYER_DATA}`, (message) => {
        let localPlayerData;

        try {
            localPlayerData = BSON.deserialize(message.pD.buffer);
        } catch (error) {
            console.error("Failed to deserialize player data BSON:", error);
            return;
        }

        const session = connection.session;

        session.localPlayerData = {
            userID: message.U,
            username: message.UN,
            realUsername: message.rUN,
            email: message.Email,
            emailVerified: message.EmailVerified,

            gems: localPlayerData.gems,
            skin: localPlayerData.skin,
            gender: localPlayerData.gender,
            countryCode: localPlayerData.countryCode,
            xpAmount: localPlayerData.xpAmount
        };

        session.inventory = session.inventoryService.createFromPlayerData(localPlayerData);
    });
};