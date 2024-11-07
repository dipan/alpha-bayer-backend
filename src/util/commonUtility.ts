import { Router } from "express";
import fs from "fs";
import moment from "moment";
import logger from "./logger/logger";
import DailyRotateFile from "winston-daily-rotate-file";
class CommonUtility {
  static getCurrentFilename(): string | undefined {
    const { stack } = new Error();

    const callerFilename = stack?.split("\n")[2].trim().split(" ")[2];
    return callerFilename;
  }

  static getCurrentDirectoryFiles(dir: string): string[] {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    return entries.filter((entry) => entry.isFile()).map((entry) => entry.name);
  }

  static getSubDirectories(dir: string): string[] {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    return entries
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name);
  }

  static capitalizeWord(word: string): string {
    if (word.length === 0) {
      return word;
    }

    const firstLetter = word.charAt(0).toUpperCase();
    const restOfWord = word.slice(1).toLowerCase();
    return firstLetter + restOfWord;
  }

  static async dynamicallyImportAndInitializeClass(
    modulePath: string,
    classname: string
  ): Promise<any> {
    try {
      const module = await import(`${modulePath}`);
      const classInstance = module.default;
      return classInstance;
    } catch (error) {
      logger.error(error);
      throw new Error(
        `Failed to dynamically import and initialize class: ${modulePath}.${classname}`
      );
    }
  }

  static displayRegisteredRouterPaths(router: Router, basePath: string) {
    router.stack.forEach((routerStack: any) => {
      Object.keys(routerStack.route.methods).forEach((method) => {
        logger.info(
          `${method.toUpperCase()} ${basePath}${routerStack.route.path}`
        );
      });
    });
  }

  static getTimeDifferenceInMillis(future: string): number {
    return moment(future).diff(moment());
  }

  /**
   * Enable debug log for provide amount of time
   * @param time time in milliseconds
   */
  static enableDebugLog(time: number) {
    const transport = new DailyRotateFile({
      dirname: "./logs",
      filename: "server_debug_%DATE%.log",
      datePattern: "YYYY-MM",
      level: "debug",
      zippedArchive: true,
      maxSize: "50m",
    });
    logger.add(transport);
    logger.debug(`ENABLE: debug log for ${time} millisecond(s)`);
    setTimeout(() => {
      logger.debug(`DISABLE: debug log`);
      logger.remove(transport);
    }, time);
  }

  static roundOfToNearestNumber(value: number, nearNumber = 1) {
    return Math.ceil(value / nearNumber) * nearNumber;
  }
}

export default CommonUtility;
