const {
  Client,
  IntentBitField,
  IntentsBitField,
  Collection,
} = require("discord.js");
require("dotenv").config();
const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ],
});

const { loadEvents } = require("./handler/eventhandler");

client.events = new Collection();
client.commands = new Collection();

(async () => {
  try {
    loadEvents(client);
  } catch (error) {
    console.log(error);
  }
})();

client.on("ready", (c) => {
  console.log(`${c.user.tag} Report on Duty!`);
});
client.login(process.env.BOTTOKEN);
