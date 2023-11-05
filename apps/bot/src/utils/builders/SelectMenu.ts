import config from '@config';
import { ISelectMenu, SelectMenuExecute } from '@typings/client';
import { Limits } from '@typings/config';

/**
 * The select menu builder, used to create select menus.
 */
export default class SelectMenu
  implements
    Required<Omit<ISelectMenu, 'execute'>>,
    Pick<ISelectMenu, 'execute'>
{
  public id: string;
  public execute?: SelectMenuExecute;
  public developer: boolean;
  public perUser: boolean;
  public disabled: boolean;
  public cooldown: Limits;

  /**
   * The select menu builder, used to create select menus.
   * @param options The options for the select menu.
   */
  public constructor(options: ISelectMenu) {
    this.id = options.id;
    this.developer = options.developer ?? false;
    this.perUser = options.perUser ?? false;
    if (options.execute) this.execute = options.execute;
    this.disabled = options.disabled ?? false;
    this.cooldown = options.cooldown ?? config.limits.cooldown.selectMenu;
  }

  /**
   * Sets the function to be executed when the select menu is used.
   * @param callback The function to be executed when the select menu is used.
   * @returns The select menu builder.
   */
  public setExecute(callback: SelectMenuExecute): this {
    this.execute = callback;
    return this;
  }
}
