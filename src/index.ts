import process from 'node:process'
import { ActivityType, Client, GatewayIntentBits } from 'discord.js'
import dotenv from 'dotenv'

dotenv.config()

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
  presence: {
    status: 'online',
    activities: [{
      name: 'customname', // emoji included directly in name
      type: ActivityType.Custom,
      state: '🚽 Cleaning the toilets', // appears as secondary text
    }],
  },
})

client.once('ready', () => {
  console.warn(`logged in as ${client.user?.tag}!`)
})

// add proper cleanup for client destruction
function cleanup() {
  client.destroy()
  process.exit(0)
}

process.once('SIGINT', cleanup)
process.once('SIGTERM', cleanup)

client.login(process.env.TOKEN)
  .catch((error) => {
    console.error('failed to login:', error)
    process.exitCode = 1
  })

// remove process.exit from uncaught handlers
process.on('uncaughtException', (error) => {
  console.error('uncaught exception:', error)
})

process.on('unhandledRejection', (reason, promise) => {
  console.error('unhandled rejection at:', promise, 'reason:', reason)
})
