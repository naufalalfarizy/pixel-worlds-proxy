const fs = require("fs");
const path = require("path");

class CommandService {
    constructor(session) {
        this.session = session;
        this.commands = new Map();

        this.loadCommands();
    }

    loadCommands() {
        const commandsPath = path.join(__dirname, "../commands");
        const files = fs.readdirSync(commandsPath);

        for (const file of files) {
            if (!file.endsWith(".js"))
                continue;

            const command = require(path.join(commandsPath, file));

            if (!command.name || typeof command.execute !== "function")
                continue;

            this.commands.set(command.name, command);

            if (Array.isArray(command.aliases)) {
                for (const alias of command.aliases) {
                    this.commands.set(alias, command);
                }
            }
        }
    }

    execute(input) {
        const parts = input.slice(1).trim().split(/\s+/);
        const name = parts.shift().toLowerCase();
        const args = parts;

        const command = this.commands.get(name);

        if (!command) {
            return false;
        }

        command.execute({
            session: this.session,
            args
        });

        return true;
    }
}

module.exports = CommandService;