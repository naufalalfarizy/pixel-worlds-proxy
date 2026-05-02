class UpstreamRouter {
    constructor({ defaultHost, defaultPort, ttlMs }) {
        this.defaultHost = defaultHost;
        this.defaultPort = defaultPort;
        this.ttlMs = ttlMs;
        this.pendingRedirects = new Map();
    }

    getDefaultUpstream() {
        return {
            host: this.defaultHost,
            port: this.defaultPort
        };
    }

    setRedirect(clientKey, host, port) {
        this.pendingRedirects.set(clientKey, {
            host,
            port,
            expiresAt: Date.now() + this.ttlMs
        });
    }

    consume(clientKey) {
        const redirect = this.pendingRedirects.get(clientKey);

        if (!redirect) {
            return this.getDefaultUpstream();
        }

        if (redirect.expiresAt <= Date.now()) {
            this.pendingRedirects.delete(clientKey);
            return this.getDefaultUpstream();
        }

        this.pendingRedirects.delete(clientKey);

        return {
            host: redirect.host,
            port: redirect.port
        };
    }

    cleanupExpired() {
        const now = Date.now();

        for (const [clientKey, redirect] of this.pendingRedirects.entries()) {
            if (redirect.expiresAt <= now) {
                this.pendingRedirects.delete(clientKey);
            }
        }
    }
}

module.exports = UpstreamRouter;