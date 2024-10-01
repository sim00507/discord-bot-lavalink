import { LavalinkManager } from "lavalink-client";
import { Client, GatewayIntentBits } from "discord.js"; // example for a discord bot
import { envConfig } from "./config";
import { BotClient } from "./types/Client";
// import interactionCreateEvent from "./events/interactionCreate";
import { parseLavalinkConnUrl, MiniMap, ManagerOptions } from "lavalink-client";
import { createClient } from "redis";
import { JSONStore, myCustomStore, myCustomWatcher, PlayerSaver } from "./utils/CustomClasses";
import { requesterTransformer, autoPlayFunction } from "./utils/OptionalFunctions";
import { handleResuming } from "./utils/handleResuming";
import { loadCommands } from "./handler/commandLoader";
import { loadEvents } from "./handler/eventsLoader";
import { loadLavalinkEvents } from "./lavalinkEvents/index"

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
(async () => {
    const playerSaver = new PlayerSaver();
    const nodeSessions = await playerSaver.getAllLastNodeSessions();

    client.lavalink = new LavalinkManager({
        nodes: [
            {
                authorization: "monosodiumglutamate",
                host: "localhost",
                port: 2333,
                id: "USA_1",
                sessionId: nodeSessions.get('USA_1'),
                requestSignalTimeoutMS: 3000, // signal for cancelling requests - default: AbortSignal.timeout(options.requestSignalTimeoutMS || 10000) - put <= 0 to disable
                closeOnError: true,
                heartBeatInterval: 30_000,
                enablePingOnStatsCheck: true,
                retryDelay: 10e3,
                secure: false,
                retryAmount: 5,
            }
        ],
        sendToShard: (guildId, payload) => client.guilds.cache.get(guildId)?.shard?.send(payload),
        autoSkip: true,
        client: {
            id: envConfig.clientId,
            username: "TESTBOT",
        },
        autoSkipOnResolveError: true, // 문제 해결되지 않은 음악 스킵
        emitNewSongsOnly: true, // 반복 재생 중인 노래는 다시 알리지 않음
        playerOptions: {
            // 기본 오류 방지 설정들
            maxErrorsPerTime: {
                threshold: 10_000, // 시간 제한 (밀리초)
                maxAmount: 3, // 주어진 시간 동안 발생할 수 있는 최대 오류 횟수
            },
            minAutoPlayMs: 10_000, // 자동 재생 간 최소 대기 시간 (밀리초)

            applyVolumeAsFilter: false,
            clientBasedPositionUpdateInterval: 50, // 클라이언트 기반의 플레이어 위치 업데이트 간격 (밀리초 단위)
            defaultSearchPlatform: "ytmsearch", // 기본 검색 플랫폼
            volumeDecrementer: 0.75, // client 100% == lavalink 75%
            requesterTransformer: requesterTransformer, // Utils.OptionalFunction
            onDisconnect: {
                autoReconnect: true, // 봇이 음성 채널에서 연결이 끊어지면 자동으로 다시 연결 시도, 실패하면 플레이어를 파괴
                destroyPlayer: false, // 자동 재연결 비활성화, 봇이 음성 채널에서 끊어지면 플레이어를 즉시 파괴
            },
            onEmptyQueue: {
                destroyAfterMs: 30_000, // 1을 설정하면 즉시 파괴, 이 옵션을 설정하지 않으면 플레이어가 파괴되지 않음
                autoPlayFunction: autoPlayFunction, // Utils.OptionalFunction
            },
            // 플레이어의 음성 채널이 비었을 때 처리
            onEmptyPlayerVoice: {
                destroyAfterMs: 30_000, // 2024-10-01 수정
            },
            useUnresolvedData: true,
        }, // playerOptions
        
        queueOptions: {
            maxPreviousTracks: 10,
            queueStore: new myCustomStore(client.redis),
            queueChangesWatcher: new myCustomWatcher(client)
        }, // queueOptions

        linksAllowed: true,
        // 예시: 포르노나 유튜브 링크를 허용하지 않음, 원하는 경우 정규식 패턴 사용 가능
        // linksBlacklist: ["porn", "youtube.com", "youtu.be"], 
        linksBlacklist: [], // url 블랙리스트 지정
        linksWhitelist: [], // url 화이트리스트 지정
        advancedOptions: {
            enableDebugEvents: true,
            maxFilterFixDuration: 600_000, // 인스턴트 필터 수정이 10분 이하의 트랙에만 적용되도록 설정
            debugOptions: {
                noAudio: false,
                playerDestroy: {
                    dontThrowError: false,
                    debugLog: false,
                },
                logCustomSearches: false,
            }
        } // advancedOptions
    } as Required<ManagerOptions>);

    handleResuming(client, playerSaver); // utils.handleResuming

    loadCommands(client); // handler.commandLoader
    loadEvents(client); // handler.eventsLoader
    loadLavalinkEvents(client); // lavalinkEvents.index

    client.login(envConfig.token);
    
})();


/*
client.on("raw", d => client.lavalink.sendRawData(d)); // send raw data to lavalink-client to handle stuff

client.on("ready", () => {
    console.log(`${client.user?.tag}으로 로그인되었습니다.`);
    client.lavalink.init({
      id: client.user.id,
      username: client.user.username
    });
  });

  client.on(interactionCreateEvent.name, (interaction) => interactionCreateEvent.execute(client, interaction));
*/