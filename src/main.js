const {
  Client,
  IntentBitField,
  IntentsBitField,
  Collection,
} = require("discord.js");
require("dotenv").config();
const mongoose = require('mongoose')
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
    mongoose.set('strictQuery',false);
    await mongoose.connect(process.env.DATABASE_URL);
    console.log("Database connected!")
    loadEvents(client);
  } catch (error) {
    console.log(error);
  }
})();

client.on("ready", (c) => {
  console.log(`${c.user.tag} Report on Duty!`);
});
client.login(process.env.BOTTOKEN);
