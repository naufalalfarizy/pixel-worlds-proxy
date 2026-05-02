const World = require("./models/World");
const Inventory = require("./models/Inventory");
const ChatService = require("../services/ChatService");
const CommandService = require("../services/CommandService");
const WorldService = require("../services/WorldService");
const InventoryService = require("../services/InventoryService");

class Session {
    constructor(connection, configData) {
        this.connection = connection;
        this.configData = configData;

        this.world = new World();
        this.inventory = new Inventory();

        this.chatService = new ChatService(this);
        this.commandService = new CommandService(this);
        this.worldService = new WorldService(this);
        this.inventoryService = new InventoryService(this);

        this.localPlayerData = null;
    }
}

module.exports = Session;