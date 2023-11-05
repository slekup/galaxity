import config from '@config';
import {
  CommandAutocomplete,
  CommandExecute,
  ISubCommand,
} from '@typings/client';
import { Limits } from '@typings/config';

/**
 * The command class, used to create new sub commands.
 */
export default class SubCommand
  implements
    Required<Omit<ISubCommand, 'execute' | 'autocomplete'>>,
    Pick<ISubCommand, 'execute' | 'autocomplete'>
{
  public subCommand: string;
  public execute?: CommandExecute;
  public autocomplete?: CommandAutocomplete;
  public developer: boolean;
  public disabled: boolean;
  public cooldown: Limits;

  /**
   * Create a new sub command.
   * @param options The command options.
   */
  public constructor(options: ISubCommand) {
    this.subCommand = options.subCommand;
    if (options.execute) this.execute = options.execute;
    if (options.autocomplete) this.autocomplete = options.autocomplete;
    this.developer = options.developer ?? false;
    this.disabled = options.disabled ?? false;
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
