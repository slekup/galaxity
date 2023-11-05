import { CronExecute, ICron } from '@typings/client';

/**
 * Cron builder, used to create a cron.
 */
export default class Cron
  implements Required<Omit<ICron, 'execute'>>, Pick<ICron, 'execute'>
{
  public id: string;
  public name: string;
  public expression: string;
  public timezone: string;
  public execute?: CronExecute;
  public disabled: boolean;

  /**
   * Create a new cron.
   * @param options The options for the cron.
   */
  public constructor(options: ICron) {
    this.id = options.id;
    this.name = options.name;
    this.expression = options.expression;
    this.timezone = options.timezone;
    if (options.execute) this.execute = options.execute;
    this.disabled = options.disabled ?? false;
  }

  /**
   * Set the execution function for the cron.
   * @param execute The execution function.
   * @returns The cron builder.
   */
  public setExecute(execute: CronExecute): this {
    this.execute = execute;
    return this;
  }
}
