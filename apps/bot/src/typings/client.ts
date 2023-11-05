/* eslint-disable import/export */
import { DeferType, FollowUpType, RespondType } from 'discord-advanced';
import {
  ActionRowBuilder,
  AnySelectMenuInteraction,
  ApplicationCommand,
  AttachmentBuilder,
  AutocompleteInteraction,
  BaseInteraction,
  ButtonBuilder,
  ButtonInteraction,
  ChatInputCommandInteraction,
  Client,
  ClientEvents,
  Collection,
  ContextMenuCommandBuilder,
  ContextMenuCommandInteraction,
  EmbedBuilder,
  Message,
  ModalSubmitInteraction,
  PermissionResolvable,
  SlashCommandBuilder,
  SlashCommandSubcommandsOnlyBuilder,
} from 'discord.js';
import { Logger } from 'winston';

import Webhooks from '@utils/managers/Webhooks';
import { Limits } from './config';

export interface IExtendedClient extends Client {}

/**
 * Base Types.
 */

interface InternalBaseInteraction {
  disabled?: boolean | undefined;
  cooldown?: Limits | undefined;
}

/**
 * Command.
 */

export type CommandData =
  | Omit<
      SlashCommandBuilder,
      | 'addSubcommand'
      | 'addSubcommandGroup'
      | 'addBooleanOption'
      | 'addUserOption'
      | 'addChannelOption'
      | 'addRoleOption'
      | 'addMentionableOption'
      | 'addNumberOption'
      | 'addIntegerOption'
      | 'addStringOption'
      | 'addChoices'
    >
  | SlashCommandSubcommandsOnlyBuilder;

type InteractionReturn = unknown;

export type CommandExecute = (
  client: IExtendedClient,
  interaction: ChatInputCommandInteraction
) => unknown;

export type CommandAutocomplete = (
  client: IExtendedClient,
  interaction: AutocompleteInteraction
) => InteractionReturn;

export interface ICommand extends InternalBaseInteraction {
  data: CommandData;
  execute?: CommandExecute;
  autocomplete?: CommandAutocomplete;
  developer?: boolean;
}

/**
 * Sub Command.
 */

export interface ISubCommand extends InternalBaseInteraction {
  subCommand: string;
  execute?: CommandExecute;
  autocomplete?: CommandAutocomplete;
  developer?: boolean;
}

/**
 * Context Menu Command.
 */

export type ContextMenuCommandExecute = (
  client: IExtendedClient,
  interaction: ContextMenuCommandInteraction,
  ...parameters: unknown[]
) => unknown;

export interface IContextMenuCommand extends InternalBaseInteraction {
  data: ContextMenuCommandBuilder;
  execute?: ContextMenuCommandExecute;
}

/**
 * Prefix Command.
 */

export type PrefixCommandExecute = (
  client: IExtendedClient,
  message: Message,
  args?: string[]
) => unknown;

export interface PrefixCommandOption {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'user' | 'channel' | 'role';
  required?: boolean;
  choices?: string[];
  min?: number;
  max?: number;
}

export interface IPrefixCommand extends InternalBaseInteraction {
  name: string;
  description: string;
  execute?: PrefixCommandExecute;
  category?: string;
  alias?: string;
  options?: PrefixCommandOption[];
  permissions?: PermissionResolvable[];
}

/**
 * Sudo Command.
 */

export type ISudoCommand = Omit<
  IPrefixCommand,
  'permissions' | 'cooldown' | 'premium'
>;

/**
 * Button.
 */

export type ButtonExecute = (
  client: IExtendedClient,
  interaction: ButtonInteraction,
  args?: string[]
) => unknown;

export interface IButton extends InternalBaseInteraction {
  id: string;
  description: string;
  execute?: ButtonExecute;
  developer?: boolean;
  perUser?: boolean;
}

/**
 * Select Menu.
 */

export type SelectMenuExecute = (
  client: IExtendedClient,
  interaction: AnySelectMenuInteraction,
  ...parameters: unknown[]
) => unknown;

export interface ISelectMenu extends InternalBaseInteraction {
  id: string;
  developer?: boolean;
  perUser?: boolean;
  execute?: SelectMenuExecute;
}

/**
 * Modal.
 */

export type ModalExecute = (
  client: IExtendedClient,
  interaction: ModalSubmitInteraction,
  args?: string[]
) => unknown;

export interface IModal extends InternalBaseInteraction {
  id: string;
  description: string;
  execute?: ModalExecute;
  developer?: boolean;
  perUser?: boolean;
}

/**
 * Cron.
 */

export type CronExecute = (client: IExtendedClient) => unknown;

export interface ICron {
  id: string;
  name: string;
  expression: string;
  timezone: string;
  execute?: CronExecute;
  disabled?: boolean;
}

/**
 * Custom Cron.
 */

export interface ICronCustom extends InternalBaseInteraction {
  id: string;
  name: string;
  execute: CronExecute;
}

/**
 * Event.
 */

export type EventExecute<T extends unknown[] = unknown[]> = (
  client: IExtendedClient,
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  ...params: T
) => Promise<void> | void;

export interface IEvent {
  rest?: boolean;
  once?: boolean;
  name: keyof ClientEvents;
  execute?: EventExecute | undefined;
  disabled?: boolean;
}

/**
 * Interface.
 */

export interface CoreInterfaceOptions {
  client?: IExtendedClient;
  interaction?: BaseInteraction;
  [key: string]: unknown;
}

interface CoreInterfaceResult {
  content?: string;
  embeds?: EmbedBuilder[];
  components?: ActionRowBuilder<ButtonBuilder>[];
  files?: AttachmentBuilder[];
}

export type CoreInterfaceFunction<T = CoreInterfaceOptions> = (
  options: T
) => CoreInterfaceResult | Promise<CoreInterfaceResult>;

/**
 * Other client types.
 */
export interface InteractionStats {
  total: number;
  slash: number;
  prefix: number;
  context: number;
  buttons: number;
  selectMenus: number;
  modals: number;
}

export interface ClientErrorParams {
  error: Error | string;
  title?: string | undefined;
  description?: string | undefined;
  footer?: string | undefined;
  interaction?: BaseInteraction | Message | undefined;
}

export interface IExtendedClient extends Client {
  botStartTime: number;
  synced: boolean;
  databaseLatency: number;
  developers: string[];

  interactions: InteractionStats;
  cpuPercentage: number;
  botOnlineMessage: unknown;
  useCommands: ApplicationCommand[];

  commands: Collection<string, ICommand>;
  subCommands: Collection<string, ISubCommand>;
  contextMenuCommands: Collection<string, IContextMenuCommand>;
  prefixCommands: Collection<string, IPrefixCommand>;
  prefixAliases: Collection<string, string>;
  sudoCommands: Collection<string, IPrefixCommand>;
  buttons: Collection<string, IButton>;
  selectMenus: Collection<string, ISelectMenu>;
  modals: Collection<string, IModal>;

  events: Collection<string, EventExecute>;

  webhooks: Webhooks;

  logger: Logger;
  respond: RespondType;
  defer: DeferType;
  followUp: FollowUpType;
  error: (params: ClientErrorParams) => Promise<void>;

  authenticate: () => Promise<void>;
  setSynced: (synced: boolean) => void;
  ensureDatabaseSynced: () => Promise<boolean>;
  setDevelopers: (developers: string[]) => void;
  setDatabaseLatency: (latency: number) => void;
  setCpuPercentage: (percentage: number) => void;
  setInteractions: (interactions: InteractionStats) => void;
  setUseCommands: (commands: ApplicationCommand[]) => void;
  setBotOnlineMessage: (message: unknown) => void;
}
