const { loadCommands } = require('../../handler/commandhandler');


module.exports = {
    name: 'ready',
    once: true,
    execute(client) {
        console.log("YO!");
        loadCommands(client);
    }
}