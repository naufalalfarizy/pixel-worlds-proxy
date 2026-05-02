const fs = require("node:fs");
const path = require("node:path");

module.exports = function registerClientHandlers(connection) {
    const handlersDir = __dirname;

    const files = fs.readdirSync(handlersDir)
        .filter((file) => file !== "index.js")
        .filter((file) => file.endsWith(".js"))
        .sort();

    for (const file of files) {
        const registerHandler = require(path.join(handlersDir, file));

        if (typeof registerHandler !== "function") {
            continue;
        }

        registerHandler(connection);
    }
};