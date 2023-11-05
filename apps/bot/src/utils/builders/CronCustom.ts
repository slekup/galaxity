import { CronExecute, ICronCustom } from '@typings/client';

/**
 * The cron class, used to create new cron jobs.
 */
export default class CronCustom implements ICronCustom {
  public id: string;
  public name: string;
  public execute: CronExecute;
  public premium?: boolean;
  public disabled?: boolean;

  /**
   * Creates a new cron job.
   * @param option The options for the cron job.
   */
  public constructor(option: ICronCustom) {
    this.id = option.id;
    this.name = option.name;
    this.execute = option.execute;
    this.disabled = option.disabled ?? false;
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
