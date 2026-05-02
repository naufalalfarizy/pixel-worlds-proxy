class Inventory {
    constructor() {
        this.slots = 0;
        this.belt1 = 0;
        this.spots = [];
        this.items = [];
    }

    clear() {
        this.slots = 0;
        this.belt1 = 0;
        this.spots = [];
        this.items = [];
    }

    getItems() {
        return [...this.items];
    }

    getItem(blockType, inventoryItemType) {
        return this.items.find((item) => {
            return item.blockType === blockType
                && item.inventoryItemType === inventoryItemType;
        }) ?? null;
    }

    getItemAmount(blockType, inventoryItemType) {
        const item = this.getItem(blockType, inventoryItemType);
        return item ? item.amount : 0;
    }

    hasItem(blockType, inventoryItemType, amount = 1) {
        return this.getItemAmount(blockType, inventoryItemType) >= amount;
    }

    addItem(blockType, inventoryItemType, amount) {
        const item = this.getItem(blockType, inventoryItemType);

        if (item) {
            item.amount += amount;
            return;
        }

        this.items.push({
            key: ((inventoryItemType & 0xff) << 24) | (blockType & 0x00ffffff),
            blockType,
            inventoryItemType,
            amount
        });
    }

    removeItem(blockType, inventoryItemType, amount) {
        const item = this.getItem(blockType, inventoryItemType);
        if (!item) {
            return;
        }

        item.amount -= amount;

        if (item.amount <= 0) {
            this.items = this.items.filter((currentItem) => {
                return !(
                    currentItem.blockType === blockType
                    && currentItem.inventoryItemType === inventoryItemType
                );
            });
        }
    }
}

module.exports = Inventory;