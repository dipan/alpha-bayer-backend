import { Request, Response, Router } from "express";

import path from "path";
import config from "../config/config";
import CommonUtility from "../util/commonUtility";
import logger from "../util/logger/logger";
import StringUtility from "../util/string.utility";

const repositoryRouter: Router = Router();
const mongoEntityDir =
  config.srcDir + path.sep + "entity" + path.sep + "mongo" + path.sep + "impl";

const mongoRepositoryDir =
  config.srcDir +
  path.sep +
  "repository" +
  path.sep +
  "mongo" +
  path.sep +
  "impl";
const repositoryFiles =
  CommonUtility.getCurrentDirectoryFiles(mongoRepositoryDir);
repositoryFiles
  .filter((file) => StringUtility.testRegexPattern("^.*.repository.*$", file))
  .forEach(async (repository, i) => {
    console.log(mongoRepositoryDir + path.sep + repository);
    // let mongoEntityInstance: any =
    //   CommonUtility.dynamicallyImportAndInitializeClass(
    //     "C:\\Projects\\JavaScript\\node-typescript-boilerplate\\src\\entity\\mongo\\impl\\user.entity.ts",
    //     "User"
    //   );
    // const repositoryInstance: MongoRepository<
    //   TBasicMongoEntity,
    //   typeof mongoEntityInstance
    // > = new (
    //   await import(mongoRepositoryDir + path.sep + repository)
    // ).default();
    // const repositoryInstance=new mongoRepository();
    const repoMatch = repository.match(new RegExp(`^(.*)(.repository.*)$`));
    const repoName = repoMatch ? repoMatch[1] : i.toString();
    repositoryRouter
      .route(`/${repoName}`)
      .post(async (req: Request, res: Response) => {
        const headers = req.headers;
        const params = req.params;
        const query = req.query;
        const body = req.body;
        // res.send({
        //   data: await repositoryInstance.create(body),
        // });
      })
      .get(async (req: Request, res: Response) => {
        const headers = req.headers;
        const params = req.params;
        const query = req.query;
        const body = req.body;
        // res.send({
        //   data: await repositoryInstance.read(),
        // });
      });
    repositoryRouter
      .route(`/${repoName}/:id`)
      .patch(async (req: Request, res: Response) => {
        const headers = req.headers;
        const { id } = req.params;
        const query = req.query;
        const body = req.body;
        // res.send({
        //   data: await repositoryInstance.updateById(id, body),
        // });
      });
    logger.info("----- Repository API -----");
    CommonUtility.displayRegisteredRouterPaths(repositoryRouter, "/repo");
  });

export default repositoryRouter;
