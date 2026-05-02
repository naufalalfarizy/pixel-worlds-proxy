const MESSAGE_IDS = require("../../constants/messageIds");

module.exports = function registerAddNewNetworkPlayerHandler(connection) {
    connection.on(`server:${MESSAGE_IDS.ADD_NEW_NETWORK_PLAYER}`, (message) => {
        const session = connection.session;
        const world = session.world;

        world.setPlayer({
            id: message.U,
            username: message.UN,
            x: message.x,
            y: message.y,
            animation: message.a,
            direction: message.d,
            spots: Array.isArray(message.spots) ? [...message.spots] : [],
            familiar: message.familiar,
            familiarName: message.familiarName,
            isFamiliarMaxLevel: message.isFamiliarMaxLevel,
            isVIP: message.IsVIP,
            vipEndTimeAge: message.VIPEndTimeAge,
            country: message.Ctry,
            age: message.Age,
            xpLevel: message.xpLvL,
            gemAmount: message.GAmt,
            achievementCount: message.ACo,
            questCount: message.QCo,
            gender: message.Gnd,
            skin: message.skin,
            faceAnimation: message.faceAnim,
            inPortal: message.inPortal,
            statusIcon: message.SIc
        });
    });
};