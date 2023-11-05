import config from '@config';
import {
  CommandAutocomplete,
  CommandData,
  CommandExecute,
  ICommand,
} from '@typings/client';
import { Limits } from '@typings/config';

/**
 * The command class, used to create new slash commands.
 */
export default class Command
  implements
    Required<Omit<ICommand, 'execute' | 'autocomplete'>>,
    Pick<ICommand, 'execute' | 'autocomplete'>
{
  public data: CommandData;
  public execute?: CommandExecute;
  public autocomplete?: CommandAutocomplete;
  public developer: boolean;
  public disabled: boolean;
  public cooldown: Limits;

  /**
   * Create a new slash command.
   * @param options The command options.
   */
  public constructor(options: ICommand) {
    this.data = options.data;
    if (options.execute) this.execute = options.execute;
    if (options.autocomplete) this.autocomplete = options.autocomplete;
    this.disabled = options.disabled ?? false;
    this.developer = options.developer ?? false;
    this.cooldown = options.cooldown ?? config.limits.cooldown.slash;
  }

  /**
   * Sets the function to be executed when the command is called.
   * @param callback The function to be executed.
   * @returns The command instance.
   */
  public setExecute(callback: CommandExecute): this {
    this.execute = callback;
    return this;
  }

  /**
   * Sets the function to be executed when the command is called with an autocomplete interaction.
   * @param callback The function to be executed when the command is called.
   * @returns The command instance.
   */
  public setAutoComplete(callback: CommandAutocomplete): this {
    this.autocomplete = callback;
    return this;
  }
}
