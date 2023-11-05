import { EventExecute, IEvent } from '@typings/client';
import { ClientEvents } from 'discord.js';

/**
 * The event class, used to create new events.
 */
export default class Event
  implements Required<Omit<IEvent, 'execute'>>, Pick<IEvent, 'execute'>
{
  public rest: boolean;
  public once: boolean;
  public name: keyof ClientEvents;
  public execute?: EventExecute<unknown[]> | undefined;
  public disabled: boolean;

  /**
   * Creates a new event.
   * @param options The options for the event.
   */
  public constructor(options: IEvent) {
    this.rest = options.rest ?? false;
    this.once = options.once ?? false;
    this.name = options.name;
    if (options.execute) this.execute = options.execute;
    this.disabled = options.disabled ?? false;
  }

  /**
   * Sets the execute function for the event.
   * @param execute The execution function.
   * @returns The event builder.
   */
  public setExecute<T extends unknown[] = unknown[]>(
    execute: EventExecute<T>
  ): this {
    this.execute = execute as EventExecute;
    return this;
  }
}
