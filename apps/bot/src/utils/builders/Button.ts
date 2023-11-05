import config from '@config';
import { ButtonExecute, IButton } from '@typings/client';
import { Limits } from '@typings/config';

/**
 * The button builder, used to create buttons.
 */
export default class
  implements Required<Omit<IButton, 'execute'>>, Pick<IButton, 'execute'>
{
  public id: string;
  public description: string;
  public execute?: ButtonExecute;
  public developer: boolean;
  public perUser: boolean;
  public disabled: boolean;
  public cooldown: Limits;

  /**
   * The button builder, used to create buttons.
   * @param options The options for the button.
   */
  public constructor(options: IButton) {
    this.id = options.id;
    this.description = options.description;
    if (options.execute) this.execute = options.execute;
    this.developer = options.developer ?? false;
    this.perUser = options.perUser ?? false;
    this.disabled = options.disabled ?? false;
    this.cooldown = options.cooldown ?? config.limits.cooldown.button;
  }

  /**
   * Sets the function to be executed when the button is pressed.
   * @param callback The function to be executed when the button is pressed.
   * @returns The button builder.
   */
  public setExecute(callback: ButtonExecute): this {
    this.execute = callback;
    return this;
  }
}
