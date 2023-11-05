import config from '@config';
import { IModal, ModalExecute } from '@typings/client';
import { Limits } from '@typings/config';

/**
 * The Modal class, used to create modals.
 */
export default class Modal
  implements Required<Omit<IModal, 'execute'>>, Pick<IModal, 'execute'>
{
  public id: string;
  public description: string;
  public execute?: ModalExecute;
  public developer: boolean;
  public perUser: boolean;
  public disabled: boolean;
  public cooldown: Limits;

  /**
   * Creates a new Modal instance.
   * @param options The options for the modal.
   */
  public constructor(options: IModal) {
    this.id = options.id;
    this.description = options.description;
    if (options.execute) this.execute = options.execute;
    this.developer = options.developer ?? false;
    this.perUser = options.perUser ?? false;
    this.disabled = options.disabled ?? false;
    this.cooldown = options.cooldown ?? config.limits.cooldown.modal;
  }

  /**
   * Sets the function to be executed when the modal is submitted.
   * @param callback The function to be executed.
   * @returns The modal builder.
   */
  public setExecute(callback: ModalExecute): this {
    this.execute = callback;
    return this;
  }
}
