const dns = require("node:dns");

const config = require("../../config");
const MESSAGE_IDS = require("../../constants/messageIds");

module.exports = function registerOtherOwnerIPHandler(connection) {
    connection.on(`server:${MESSAGE_IDS.OTHER_OWNER_IP}`, (message) => {
        const redirectHost = message.IP;

        dns.lookup(redirectHost, { family: 4 }, (err, address) => {
            if (err) {
                console.error(`Failed to resolve redirect host "${redirectHost}":`, err);
                return;
            }

            connection.emit("redirect", {
                host: address,
                port: config.upstream.port
            });
        });

        message.IP = config.redirect.host;
    });
};