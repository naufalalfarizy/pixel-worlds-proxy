class World {
    constructor() {
        this.sizeX = 0;
        this.sizeY = 0;

        this.tiles = [];
        this.collectables = [];
        this.players = new Map();
    }

    initialize(sizeX, sizeY) {
        this.sizeX = sizeX;
        this.sizeY = sizeY;

        this.tiles = new Array(sizeX * sizeY);
    }

    reset() {
        this.sizeX = 0;
        this.sizeY = 0;

        this.tiles = [];
        this.collectables = [];
        this.players = new Map();
    }

    getIndex(x, y) {
        return x + y * this.sizeX;
    }

    inBounds(x, y) {
        return x >= 0 && x < this.sizeX && y >= 0 && y < this.sizeY;
    }

    getTile(x, y) {
        if (!this.inBounds(x, y))
            return null;

        return this.tiles[this.getIndex(x, y)];
    }

    setTile(x, y, tile) {
        if (!this.inBounds(x, y))
            return;

        this.tiles[this.getIndex(x, y)] = tile;
    }

    updateTileLayer(x, y, layer, value) {
        const tile = this.getTile(x, y);
        if (!tile)
            return;

        tile[layer] = value;
    }

    addCollectable(collectable) {
        this.collectables.push(collectable);
    }

    removeCollectable(matchFn) {
        this.collectables = this.collectables.filter((collectable) => !matchFn(collectable));
    }

    setPlayer(player) {
        this.players.set(player.id, player);
    }

    removePlayer(id) {
        this.players.delete(id);
    }

    getPlayer(id) {
        return this.players.get(id);
    }
}

module.exports = World;