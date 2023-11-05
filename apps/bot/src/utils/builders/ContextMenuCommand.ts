import config from '@config';
import {
  ContextMenuCommandExecute,
  IContextMenuCommand,
} from '@typings/client';
import { Limits } from '@typings/config';
import { ContextMenuCommandBuilder } from 'discord.js';

/**
 * The command class, used to create new context menu commands.
 */
export default class ContextMenuCommand
  implements
    Required<Omit<IContextMenuCommand, 'execute'>>,
    Pick<IContextMenuCommand, 'execute'>
{
  public data: ContextMenuCommandBuilder;
  public execute?: ContextMenuCommandExecute;
  public disabled: boolean;
  public cooldown: Limits;

  /**
   * Create a new context menu command.
   * @param options The command options.
   */
  public constructor(options: IContextMenuCommand) {
    this.data = options.data;
    if (options.execute) this.execute = options.execute;
    this.disabled = options.disabled ?? false;
    this.cooldown = options.cooldown ?? config.limits.cooldown.context;
  }

  /**
   * Sets the function to be executed when the command is called.
   * @param callback The function to be executed.
   * @returns The command instance.
   */
  public setExecute(callback: ContextMenuCommandExecute): this {
    this.execute = callback;
    return this;
  }
}
