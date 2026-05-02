const Inventory = require("../game/models/Inventory");

class InventoryService {
    createFromPlayerData(playerData) {
        const inventory = new Inventory();

        inventory.slots = Number(playerData?.slots) || 0;
        inventory.belt1 = Number(playerData?.belt1) || 0;
        inventory.spots = Array.isArray(playerData?.spots) ? [...playerData.spots] : [];

        if (playerData?.inv?.buffer) {
            inventory.items = this.deserializeInventory(playerData.inv.buffer);
        }

        return inventory;
    }

    deserializeInventory(buffer) {
        const items = [];

        for (let offset = 0; offset + 6 <= buffer.length; offset += 6) {
            const key = buffer.readUInt32LE(offset);
            const amount = buffer.readInt16LE(offset + 4);

            const blockType = key & 0x00ffffff;
            const inventoryItemType = (key >>> 24) & 0xff;

            items.push({
                key,
                blockType,
                inventoryItemType,
                amount
            });
        }

        return items;
    }

    serializeInventory(inventory) {
        const buffer = Buffer.alloc(inventory.items.length * 6);

        let offset = 0;

        for (const item of inventory.items) {
            const key = ((item.inventoryItemType & 0xff) << 24) | (item.blockType & 0x00ffffff);

            buffer.writeUInt32LE(key, offset);
            buffer.writeInt16LE(item.amount, offset + 4);

            offset += 6;
        }

        return buffer;
    }
}

module.exports = InventoryService;