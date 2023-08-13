async function loadCommands(client) {
    const { loadFiles } = require('../function/fileloader')
    client.commands = new Map();
    const commands = new Array();
    console.time("Commands Loaded")
    const files = await loadFiles("Commands");
    let commandsarray = []

    for (const file of files) {
        try {
            const command = require(file);
            client.commands.set(command.data.name, command);
            commandsarray.push(command.data.toJSON());
            commands.push({ Command: command.data.name, Status: "✅" });


        } catch (ex) {
            console.log(ex);
            commands.push({ Command: file.split("/").pop().slice(0, -3), Status: "🛑" });
        };
    };

    client.application.commands.set(commandsarray);
    console.table(commands, ["Command", "Status"]);
    console.info("\n\x1b[36m%s\x1b[0m", "Loaded commands.");
    console.timeEnd("Commands Loaded");

}
module.exports = { loadCommands };