require("dotenv").config();

module.exports = {
    upstream: {
        host: process.env.UPSTREAM_HOST,
        port: Number(process.env.UPSTREAM_PORT)
    },

    proxy: {
        host: process.env.PROXY_HOST,
        port: Number(process.env.PROXY_PORT)
    },

    redirect: {
        host: process.env.REDIRECT_HOST,
        ttlMs: Number(process.env.REDIRECT_TTL_MS)
    },

    debug: {
        clientMessages: process.env.DEBUG_CLIENT_MESSAGES === "true",
        serverMessages: process.env.DEBUG_SERVER_MESSAGES === "true"
    }
};