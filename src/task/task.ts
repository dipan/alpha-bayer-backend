import cron, { ScheduledTask } from "node-cron";

export enum TaskStatus {
  INITIALIZED = "INITIALIZED",
  SCHEDULED = "SCHEDULED",
  RUNNING = "RUNNING",
  WAITING = "WAITING",
  FINISHED = "FINISHED",
  CANCELLED = "CANCELLED",
  TERMINATED = "TERMINATED",
}

export enum TaskPriority {
  LOW = 0,
  NORMAL = 1,
  HIGH = 2,
  CRITICAL = 3,
}

export type TTask = {
  name: string;
  description?: string;
  cronExpression: string;
  scheduledTime: string;
  scheduled: boolean;
  dueDate: Date;
  status: TaskStatus;
  priority: TaskPriority;
  parameter?: any;
};

export default interface ITask {
  detail: TTask;
  scheduledTask: ScheduledTask;
  run(): void;
}

export abstract class ATask {
  start(task: ITask) {
    if (cron.validate(task.detail.cronExpression))
      task.scheduledTask = cron.schedule(
        task.detail.cronExpression,
        () => task.run(),
        {
          name: task.detail.name,
          scheduled: !task.detail.scheduled,
        }
      );
  }

  stop(task: ITask) {
    task.scheduledTask.stop();
  }

  reschedule(task: ITask) {
    this.stop(task);
    this.start(task);
  }
}
