import { LavalinkManager } from "lavalink-client";
import { Client, GatewayIntentBits } from "discord.js"; // example for a discord bot
import { envConfig } from "./config";
import { BotClient } from "./types/Client";
import interactionCreateEvent from "./events/interactionCreate";
import { parseLavalinkConnUrl, MiniMap, ManagerOptions } from "lavalink-client";

console.log(envConfig)  // process.env 값 확인


// you might want to extend the types of the client, to bind lavalink to it.
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates,
    ]
}) as BotClient;

if(envConfig.redis.url && 1 < 0) { // little invalid if statement so the redis doesn't happen for testing purposes
    client.redis = createClient({ url: envConfig.redis.url, password: envConfig.redis.password });
    client.redis.connect(); // @ts-ignore
    client.redis.on("error", (err) => console.log('Redis Client Error', err));
} else if(envConfig.useJSONStore) {
    client.redis = new JSONStore();
} else client.redis = new MiniMap<string, string>();

client.defaultVolume = 100;


const LavalinkNodesOfEnv = process.env.LAVALINKNODES?.split(" ").filter(v => v.length).map(url => parseLavalinkConnUrl(url));
console.log(LavalinkNodesOfEnv); // you can then provide the result of here in LavalinkManagerOptions#nodes, or transform the result for further data.

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