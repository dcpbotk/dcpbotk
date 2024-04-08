import { Client, Partials, Collection } from "discord.js";
import { readdirSync } from "fs"
import 'dotenv/config'
import mongoose from "mongoose"


const client = new Client({
  intents: [
    "Guilds",
    "GuildMessages",
    "MessageContent",
    "GuildMembers",
    "GuildModeration",
    "GuildVoiceStates"
  ],
  partials: [Partials.User, Partials.Channel, Partials.Message],
});
// // Assigments
client.commands = new Collection()
client.embed = await import("./utils/bot/embed.js").then(m => m.default)

// Initialize Database
await mongoose.connect(process.env.mongotkn)
.then(() => {
    console.log("Veri tabanı başarıyla çalıştı.")
})

// Event Loader
readdirSync("./events").forEach(async file => {
  const event = await import(`./events/${file}`).then(m => m.default)
  event(client)
})

// Command Loader
client.commands = new Collection()
readdirSync("./commands").forEach(category => {
  readdirSync(`./commands/${category}`).forEach(async file => {
    const command = await import(`./commands/${category}/${file}`)
    client.commands.set(command.data.name, command)
  })
})

client.login(process.env.token);