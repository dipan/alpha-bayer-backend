import BrevoEmailNotification from "../../notification/impl/brevoEmail.notification";
import logger from "../../util/logger/logger";
import ITask, { TTask, TaskPriority, TaskStatus } from "../task";
import { ScheduledTask } from "node-cron";

export default class BrevoBalanceTask implements ITask {
  detail: TTask;
  scheduledTask!: ScheduledTask;
  constructor(name?: string) {
    if (!name) {
      name = this.constructor.name;
    }
    this.detail = {
      name,
      cronExpression: "0 0 */12 * * *",
      scheduledTime: "",
      scheduled: false,
      dueDate: new Date(),
      status: TaskStatus.INITIALIZED,
      priority: TaskPriority.NORMAL,
    };
  }

  async run(): Promise<void> {
    try {
      logger.info("RUNNING: BrevoBalanceTask(" + this.detail?.name + ")");
      this.detail.status = TaskStatus.RUNNING;
      new BrevoEmailNotification(
        [{ name: "BrevoBalanceTask", email: "mandal.common@gmail.com" }],
        JSON.stringify(
          (await new BrevoEmailNotification().getAccountDetails()).data
        )
      ).notify();
      this.detail.status = TaskStatus.SCHEDULED;
    } catch (error) {}
  }
}
