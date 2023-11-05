import {
  ISudoCommand,
  PrefixCommandExecute,
  PrefixCommandOption,
} from '@typings/client';

/**
 * The sudo command builder, used to create a sudo command.
 */
export default class SudoCommand
  implements
    Required<Omit<ISudoCommand, 'execute' | 'category' | 'alias'>>,
    Pick<ISudoCommand, 'execute' | 'category' | 'alias'>
{
  public name: string;
  public description: string;
  public execute?: PrefixCommandExecute;
  public category?: string;
  public alias?: string;
  public options: PrefixCommandOption[];
  public disabled: boolean;

  /**
   * Creates a new sudo command.
   * @param options The options for the command.
   */
  public constructor(options: ISudoCommand) {
    this.name = options.name;
    this.description = options.description;
    if (options.execute) this.execute = options.execute;
    if (options.category) this.category = options.category;
    if (options.alias) this.alias = options.alias;
    this.disabled = options.disabled ?? false;
    this.options = options.options ?? [];
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
