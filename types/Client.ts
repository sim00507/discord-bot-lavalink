import {
	AutocompleteInteraction, ChatInputCommandInteraction, Client, SlashCommandBuilder,
	SlashCommandSubcommandBuilder, SlashCommandSubcommandGroupBuilder,
	SlashCommandSubcommandsOnlyBuilder
} from "discord.js";
import { LavalinkManager } from "lavalink-client";
import { MiniMap } from "lavalink-client";
import { RedisClientType } from "redis";
import { JSONStore } from "../utils/CustomClasses"

declare type InteractionExecuteFN = (client:BotClient, interaction:ChatInputCommandInteraction<"cached">) => any;
declare type AutoCompleteExecuteFN = (client:BotClient, interaction:AutocompleteInteraction) => any;

export interface CustomRequester {
    id: string,
    username: string,
    avatar?: string,
}

export interface Command {
    data: SlashCommandBuilder;
    execute: InteractionExecuteFN;
    autocomplete?: AutoCompleteExecuteFN;
}

type subCommandExecute = { [subCommandName:string]: InteractionExecuteFN };
type subCommandAutocomplete = { [subCommandName:string]: AutoCompleteExecuteFN };

export interface SubCommand {
    data: SlashCommandSubcommandBuilder | SlashCommandSubcommandGroupBuilder | SlashCommandSubcommandsOnlyBuilder;
    execute: subCommandExecute;
    autocomplete?: subCommandAutocomplete;
}

export interface BotClient extends Client {
    lavalink: LavalinkManager;
    commands: MiniMap<string, Command|SubCommand>
    redis: RedisClientType | JSONStore | MiniMap<string, string>;
    defaultVolume: number;
}
export interface Event {
    name: string,
    execute: (client:BotClient, ...params:any) => any;
}