import cron from "node-cron";
import path from "path";
import config from "../config/config";
import CommonUtility from "../util/commonUtility";
import logger from "../util/logger/logger";
import StringUtility from "../util/string.utility";
import ITask from "./task";

export default class TaskManager {
  private static instance: TaskManager;
  private tasks: Map<string, ITask>;

  private constructor() {
    this.tasks = new Map<string, ITask>();
  }

  public static getInstance(): TaskManager {
    if (!TaskManager.instance) {
      TaskManager.instance = new TaskManager();
      this.loadTasks();
    }
    return TaskManager.instance;
  }

  private static loadTasks(): void {
    const taskImplementations: string[] =
      CommonUtility.getCurrentDirectoryFiles(
        config.srcDir + path.sep + "task" + path.sep + "impl"
      );
    taskImplementations.forEach(async (task) => {
      console.log(`Loading task: ${task}`);
      const taskClass: ITask =
        new (await CommonUtility.dynamicallyImportAndInitializeClass(
          config.srcDir +
            path.sep +
            "task" +
            path.sep +
            "impl" +
            path.sep +
            task,
          task
        ))();
      TaskManager.getInstance().addTask(taskClass);
    });
  }

  public addTask(task: ITask): void {
    try {
      const id = `${task.detail.name}_${Date.now()}`;
      if (!StringUtility.isEmptyOrNull(task.detail.scheduledTime)) {
        const scheduleMillis = CommonUtility.getTimeDifferenceInMillis(
          task.detail.scheduledTime
        );
        setTimeout(() => task.run(), scheduleMillis);
      } else if (!StringUtility.isEmptyOrNull(task.detail.cronExpression)) {
        const scheduledTask = cron.schedule(
          task.detail.cronExpression,
          () => task.run(),
          {
            name: task.detail.name,
            scheduled: !task.detail.scheduled,
          }
        );
        task.scheduledTask = scheduledTask;
        scheduledTask.start();
      }
      this.tasks.set(id, task);
    } catch (error: any) {
      logger.error(error.message);
    }
  }

  public removeJob(id: string): void {
    const scheduledTask: ITask | undefined = this.tasks.get(id);
    if (scheduledTask) {
      scheduledTask.scheduledTask.stop();
      this.tasks.delete(id);
    }
  }

  public getAllJobs(): { id: string }[] {
    return Array.from(this.tasks.entries()).map(([id, task]) => ({
      id,
      detail: task.detail,
    }));
  }

  public startTask(id: string, taskParameter?: any) {
    const task = this.tasks.get(id);
    if (!task) {
      throw new Error(`Task[${id}] not found`);
    }
    if (taskParameter) {
      task.detail.parameter = taskParameter;
    }
    task.run();
  }
}
