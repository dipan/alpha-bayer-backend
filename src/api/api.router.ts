import { Router } from "express";
import fs from "fs";
import path from "path";
import logger from "../util/logger/logger";
import JWTUtility from "../util/jwt.utility";
import taskRouter from "./task.router";
import CommonUtility from "../util/commonUtility";

export type ApiResponse = {
  status: number;
  body: {
    code?: number;
    message: string;
    data?: any;
    meta?: any;
    [key: string]: any;
  };
};

const apiRouter: Router = Router();
// const subDirectoryRouter: Router = Router();
const pathParse = path.parse(__filename);
logger.info(pathParse);
// fs.readdirSync(__dirname).forEach((file) => {
//   logger.debug(pathParse.dir + path.sep + file);
//   if (fs.statSync(pathParse.dir + path.sep + file).isDirectory()) {
//     registerSubdirectoryRouter(pathParse.dir + path.sep + file);
//   }
// });

function registerSubdirectoryRouter(
  subDirectoryRouter: Router,
  subdir: string
): void {
  fs.readdirSync(subdir).forEach(async (subdirFile) => {
    const subdirFilePath = subdir + path.sep + subdirFile;
    const subdirFileStat: fs.Stats = fs.statSync(subdirFilePath);
    if (subdirFileStat.isDirectory()) {
      registerSubdirectoryRouter(subDirectoryRouter, subdirFilePath);
    } else {
      const matchRouterTs = subdirFilePath
        .replace(new RegExp("\\\\", "g"), "/")
        .match(new RegExp(/(.*\/api)((\/.*)(\/.*)|(\/.*))(\/.*\.router\.*)/));
      if (matchRouterTs) {
        try {
          const mod: Router = (await import(subdirFilePath)).default;
          const routerPath = matchRouterTs[4] ? matchRouterTs[4] : "/";
          subDirectoryRouter.use(`${routerPath}`, mod);
          logger.info(`----- ${routerPath.toUpperCase()} API -----`);
          CommonUtility.displayRegisteredRouterPaths(mod, "/api");
        } catch (error: any) {
          logger.error(error.message);
          logger.error(`Please check router file: ${subdirFilePath}`);
        }
      }
    }
  });
}

const v0Router: Router = Router();
registerSubdirectoryRouter(v0Router, pathParse.dir + path.sep + "v0");

const publicRouter: Router = Router();
registerSubdirectoryRouter(publicRouter, pathParse.dir + path.sep + "public");

apiRouter.use("/v0", JWTUtility.tokenValidationHandler, v0Router);
apiRouter.use("/public", JWTUtility.tokenPayloadRetriveHandler, publicRouter);
apiRouter.use("/task", taskRouter);

export default apiRouter;
