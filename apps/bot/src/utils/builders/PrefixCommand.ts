import config from '@config';
import {
  IPrefixCommand,
  PrefixCommandExecute,
  PrefixCommandOption,
} from '@typings/client';
import { Limits } from '@typings/config';
import { PermissionResolvable } from 'discord.js';

/**
 * The prefix command builder, used to create a prefix command.
 */
export default class PrefixCommand
  implements
    Required<Omit<IPrefixCommand, 'execute' | 'category' | 'alias'>>,
    Pick<IPrefixCommand, 'execute' | 'category' | 'alias'>
{
  public name: string;
  public description: string;
  public execute?: PrefixCommandExecute;
  public category?: string;
  public alias?: string;
  public options: PrefixCommandOption[];
  public permissions: PermissionResolvable[];
  public disabled: boolean;
  public cooldown: Limits;

  /**
   * Creates a new prefix command builder.
   * @param options The options for the command.
   */
  public constructor(options: IPrefixCommand) {
    this.name = options.name;
    this.description = options.description;
    if (options.execute) this.execute = options.execute;
    if (options.category) this.category = options.category;
    if (options.alias) this.alias = options.alias;
    this.disabled = options.disabled ?? false;
    this.options = options.options ?? [];
    this.permissions = options.permissions ?? [];
    this.cooldown = options.cooldown ?? config.limits.cooldown.prefix;
  }

  /**
   * Sets the function to be executed when the command is called.
   * @param callback The function to be executed.
   * @returns The command instance.
   */
  public setExecute(callback: PrefixCommandExecute): this {
    this.execute = callback;
    return this;
  }
}
