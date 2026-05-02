const fs = require("node:fs");
const path = require("node:path");
const csvParser = require("csv-parser");

class ConfigData {
    constructor() {
        this.blockTypes = new Map();
    }

    async initialize() {
        this.blockTypes = await this.loadBlockTypes();
    }

    loadBlockTypes() {
        const filePath = path.join(__dirname, "../data/csv/block-types.csv");

        return new Promise((resolve, reject) => {
            const blockTypes = new Map();

            fs.createReadStream(filePath)
                .pipe(csvParser())
                .on("data", (row) => {
                    const blockType = Number(row.block_type);
                    const inventoryItemType = Number(row.inventory_item_type);
                    const blockTypeName = row.block_type_name;

                    if (!Number.isInteger(blockType) || !Number.isInteger(inventoryItemType)) {
                        return;
                    }

                    blockTypes.set(blockType, {
                        blockType,
                        blockTypeName,
                        inventoryItemType
                    });
                })
                .on("end", () => resolve(blockTypes))
                .on("error", reject);
        });
    }

    getBlockTypeData(blockType) {
        return this.blockTypes.get(blockType) ?? null;
    }

    getInventoryItemType(blockType) {
        return this.getBlockTypeData(blockType)?.inventoryItemType ?? null;
    }

    getBlockTypeName(blockType) {
        return this.getBlockTypeData(blockType)?.blockTypeName ?? null;
    }
}

module.exports = ConfigData;