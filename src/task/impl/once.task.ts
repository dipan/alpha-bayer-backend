import { ScheduledTask } from "node-cron";
import ITask, { ATask, TTask, TaskPriority, TaskStatus } from "../task";
import logger from "../../util/logger/logger";
import cronstrue from "cronstrue";
import moment from "moment";
import SuperAdminService from "../../api/v0/superadmin/superadmin.service";

export default class OneTask extends ATask implements ITask {
  detail: TTask;
  scheduledTask!: ScheduledTask;

  constructor(name?: string) {
    super();
    if (!name) {
      name = this.constructor.name;
    }
    this.detail = {
      name,
      cronExpression: "*/30 * * * * *",
      scheduledTime: "2023-06-12 00:49:48",
      scheduled: true,
      dueDate: new Date(),
      status: TaskStatus.INITIALIZED,
      priority: TaskPriority.NORMAL,
    };
  }

  run(): void {
    this.detail.status = TaskStatus.RUNNING;
    logger.info(`${this.detail.status}: ${moment().toString()}`);
    const superAdminService = new SuperAdminService();
    superAdminService.registerSuperAdmin();
  }
}
