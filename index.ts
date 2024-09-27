import { LavalinkManager } from "lavalink-client";
import { Client, GatewayIntentBits } from "discord.js"; // example for a discord bot

// you might want to extend the types of the client, to bind lavalink to it.
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates,
    ]
});

// create instance
client.lavalink = new LavalinkManager({
    nodes: [
        {
            authorization: "localhoist",
            host: "localhost",
            port: 2333,
            id: "testnode",
        }
    ],
    sendToShard: (guildId, payload) => client.guilds.cache.get(guildId)?.shard?.send(payload),
    autoSkip: true,
    client: {
        id: envConfig.clientId,
        username: "TESTBOT",
    },
});

client.on("raw", d => client.lavalink.sendRawData(d)); // send raw data to lavalink-client to handle stuff

client.on("ready", () => {
    client.lavalink.init(client.user); // init lavalink
});
