import { LavalinkManager } from "lavalink-client";
import { Client, GatewayIntentBits } from "discord.js"; // example for a discord bot
import { envConfig } from "./config";
import { BotClient } from "./types/Client";
import interactionCreateEvent from "./events/interactionCreate";

console.log(envConfig)  // process.env 값 확인


// you might want to extend the types of the client, to bind lavalink to it.
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates,
    ]
}) as BotClient;

// create instance
client.lavalink = new LavalinkManager({
    nodes: [
        {
            authorization: "monosodiumglutamate",
            host: "localhost",
            port: 2333,
            id: "USA_1",
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
    console.log(`${client.user?.tag}으로 로그인되었습니다.`);
    client.lavalink.init({
      id: client.user.id,
      username: client.user.username
    });
  });

  client.on(interactionCreateEvent.name, (interaction) => interactionCreateEvent.execute(client, interaction));

  client.login(envConfig.token);