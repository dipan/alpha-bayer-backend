import cors from "cors";
import express, {
  Express,
  NextFunction,
  Request,
  Response,
  Router,
} from "express";
import fileUpload from "express-fileupload";
import moment from "moment";
import mongoose from "mongoose";
import path from "path";
import apiRouter from "./api/api.router";
import entityRouter from "./api/entity.router";
import repositoryRouter from "./api/repository.router";
import config from "./config/config";
import { DatabaseManager } from "./db/mongodb-manager";
import BrevoEmailNotification from "./notification/impl/brevoEmail.notification";
import TaskManager from "./task/task.manager.";
import CommonUtility from "./util/commonUtility";
import logger from "./util/logger/logger";

const app: Express = express();
app.use(express.json());
app.use(cors());
app.use(
  fileUpload({
    limits: { fileSize: 5 * 1024 * 1024 },
    createParentPath: true,
    safeFileNames: true,
    preserveExtension: 5,
    limitHandler: function (req, res, next) {
      logger.warn("File size limit has been exceeded");
    },
    abortOnLimit: false,
    useTempFiles: true,
    tempFileDir: "./temp/apiuploads",
  })
);
app.use(express.static(path.join(__dirname, "public")));

app.use("/", (req: Request, res: Response, next: NextFunction) => {
  next();
  logger.info(getFormattedRequestObject(req));
});

const rootRouter = Router();

rootRouter.get("/devProfile", (req: Request, res: Response) => {
  res.redirect("https://dipan.dev");
});

rootRouter.get("/health", (req: Request, res: Response) => {
  const uptimeDuration = moment.duration(process.uptime(), "seconds");
  const uptimeDurationString =
    (uptimeDuration.get("days") ? `${uptimeDuration.get("days")}D` : "") ||
    (uptimeDuration.get("hours") ? `${uptimeDuration.get("hours")}H` : "") ||
    (uptimeDuration.get("minutes")
      ? `${uptimeDuration.get("minutes")}m`
      : "") ||
    (uptimeDuration.get("seconds") ? `${uptimeDuration.get("seconds")}S` : "");
  res.status(200).send({
    message: `Server listening @${config.host}:${config.port}`,
    arch: process.arch,
    nodeVersion: process.version,
    os: process.env.OS,
    pid: process.pid,
    platform: process.platform,
    ppid: process.ppid,
    title: process.title,
    uptime: uptimeDurationString,
    tasks: TaskManager.getInstance().getAllJobs(),
  });
});

rootRouter.get("/config", async (req: Request, res: Response) => {
  let { jwt, mongodb, mysql, smtp, ...viewConfig } = config;
  const response: any = { ...viewConfig };
  response.mailCoountDetails = (
    await new BrevoEmailNotification().getAccountDetails()
  ).data;
  res.status(200).send(response);
});

app.use(rootRouter);

async function startApplication() {
  CommonUtility.enableDebugLog(45 * 1000);
  const DB_URL = config.mongodb.url;
  // "mongodb+srv://mongo-admin:MQNrAOaT0cuJbd3P@cluster0.hiqxi5g.mongodb.net/?retryWrites=true&w=majority";
  mongoose
    .connect(DB_URL, {
      dbName: config.mongodb.collection,
    })
    .then(() => {
      logger.info("Mongo DB Connected");
    });

  const databaseManager = DatabaseManager.getInstance();
  databaseManager.connect(DB_URL, config.mongodb.collection);

  // const MYSQL_DB_URL = config.mysql.url;

  // try {
  //   MySQLDatabaseConnection.getInstance();
  // } catch (error) {
  //   console.log(error);
  // }

  app.use("/api", apiRouter);
  app.use("/entity", entityRouter);
  app.use("/repo", repositoryRouter);

  app.listen(config.port, config.host, () => {
    logger.info(`Server listening @${config.host}:${config.port}`);
    CommonUtility.enableDebugLog(60000);
    TaskManager.getInstance();
  });
}

function getFormattedRequestObject(req: Request) {
  let logObject: {
    version: string;
    majorVersion: number;
    minorVersion: number;
    [key: string]: any;
  };
  logObject = {
    version: req.httpVersion,
    majorVersion: req.httpVersionMajor,
    minorVersion: req.httpVersionMinor,
  };
  logObject.method = req.method;
  logObject.originalURL = req.originalUrl;
  logObject.baseURL = req.baseUrl;
  logObject.url = req.url;
  logObject.headers = req.headers;
  logObject.params = req.params;
  logObject.query = req.query;
  logObject.body = req.body;
  logObject.files = req.files;

  return logObject;
}

const match = __dirname
  .replace(new RegExp("\\\\", "g"), "/")
  .match(new RegExp(/(.*)(src)(.*)/));
const basePath = match ? match[3] : null;
CommonUtility.displayRegisteredRouterPaths(rootRouter, basePath ?? "/");

startApplication();
