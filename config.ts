import { config } from "dotenv";

config();

export const envConfig = {
    token: process.env.DISCORD_TOKEN as string,
    clientId: process.env.CLIENT_ID as string,
    redis: {
        url: process.env.REDIS_URL as string,
        password: process.env.REDIS_PASSWORD as string
    },
    useJSONStore: !process.env.REDIS_URL ? true : false,
    devGuild: "753210772045430814",
    voiceChannelId: "753210772045430820",
    textChannelId: "1095003015385198713"
}
