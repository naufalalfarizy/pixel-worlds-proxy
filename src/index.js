const net = require("node:net");

const config = require("./config");
const ProxyConnection = require("./core/ProxyConnection");
const UpstreamRouter = require("./core/UpstreamRouter");
const ConfigData = require("./game/ConfigData");

async function main() {
    const configData = new ConfigData();
    await configData.initialize();

    const upstreamRouter = new UpstreamRouter({
        defaultHost: config.upstream.host,
        defaultPort: config.upstream.port,
        ttlMs: config.redirect.ttlMs
    });

    const server = net.createServer((clientSocket) => {
        const clientKey = clientSocket.remoteAddress;
        const upstreamTarget = upstreamRouter.consume(clientKey);

        const connection = new ProxyConnection(clientSocket, configData, upstreamTarget);

        connection.on("redirect", ({ host, port }) => {
            upstreamRouter.setRedirect(clientKey, host, port);
        });

        connection.on("error", (error) => {
            console.error(error);
        });
    });

    setInterval(() => upstreamRouter.cleanupExpired(), 1000);

    server.listen(config.proxy.port, config.proxy.host, () => {
        console.log(`Listening on ${config.proxy.host}:${config.proxy.port}`);
    });
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});