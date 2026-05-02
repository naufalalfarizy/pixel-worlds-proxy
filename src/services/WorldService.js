const { BSON } = require("bson");
const zlib = require("node:zlib");

class WorldService {
    constructor(session) {
        this.session = session;
        this.world = session.world;
    }

    deserializeWorld(compressedWorldBuffer) {
        let decompressedWorldBuffer;

        try {
            decompressedWorldBuffer = zlib.zstdDecompressSync(compressedWorldBuffer);
        } catch (error) {
            console.error("Failed to decompress world buffer:", error);
            return null;
        }

        try {
            return BSON.deserialize(decompressedWorldBuffer);
        } catch (error) {
            console.error("Failed to deserialize world BSON:", error);
            return null;
        }
    }

    loadTiles(worldData, sizeX, sizeY) {
        const blockLayerBuffer = worldData.BlockLayer.buffer;
        const backgroundLayerBuffer = worldData.BackgroundLayer.buffer;
        const waterLayerBuffer = worldData.WaterLayer.buffer;
        const wiringLayerBuffer = worldData.WiringLayer.buffer;

        let layerIndex = 0;

        for (let y = sizeY - 1; y >= 0; y--) {
            for (let x = 0; x < sizeX; x++) {
                const offset = layerIndex * 2;

                this.world.setTile(x, y, {
                    x,
                    y,
                    block: blockLayerBuffer.readUInt16LE(offset),
                    background: backgroundLayerBuffer.readUInt16LE(offset),
                    water: waterLayerBuffer.readUInt16LE(offset),
                    wiring: wiringLayerBuffer.readUInt16LE(offset)
                });

                layerIndex++;
            }
        }
    }

    loadCollectables(collectables) {
        if (!collectables || !Number.isInteger(collectables.Count)) {
            return;
        }

        for (let index = 0; index < collectables.Count; index++) {
            const collectable = collectables[`C${index}`];
            if (!collectable) {
                continue;
            }

            this.world.addCollectable({
                collectableID: collectable.CollectableID,
                blockType: collectable.BlockType,
                amount: collectable.Amount,
                inventoryType: collectable.InventoryType,
                posX: collectable.PosX,
                posY: collectable.PosY,
                isGem: collectable.IsGem,
                gemType: collectable.GemType
            });
        }
    }
}

module.exports = WorldService;