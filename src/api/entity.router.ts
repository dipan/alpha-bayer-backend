import { Request, Response, Router } from "express";

import { Model } from "mongoose";
import path from "path";
import config from "../config/config";
import IMongoEntity, {
  DEFAULT_BASIC_MONGO_ENTITY,
} from "../entity/mongo/mongo.entity";
import CommonUtility from "../util/commonUtility";
import logger from "../util/logger/logger";
import StringUtility from "../util/string.utility";
import { ApiResponse } from "./api.router";

const entityRouter: Router = Router();
const entityDir =
  config.srcDir + path.sep + "entity" + path.sep + "mongo" + path.sep + "impl";
const entityFiles = CommonUtility.getCurrentDirectoryFiles(entityDir);
entityFiles
  .filter((file) => StringUtility.testRegexPattern("^.*.entity.*$", file))
  .forEach(async (entity, i) => {
    console.log(entityDir + path.sep + entity);
    const entityMatch = entity.match(new RegExp(`^(.*)(.entity.*)$`));
    const entityName = entityMatch ? entityMatch[1] : i.toString();
    const entityInstance: IMongoEntity =
      new (await CommonUtility.dynamicallyImportAndInitializeClass(
        entityDir + path.sep + entityName + ".entity",
        CommonUtility.capitalizeWord(entityName) + "Entity"
      ))();
    const entityModel: Model<Document> = entityInstance.getModel();
    entityRouter
      .route(`/${entityName}`)
      .post(async (req: Request, res: Response) => {
        const headers = req.headers;
        const params = req.params;
        const query = req.query;
        const body = req.body;
        const apiResponse: ApiResponse = {
          status: 201,
          body: { message: "CREATED" },
        };
        try {
          const newEntity = new entityModel({
            ...DEFAULT_BASIC_MONGO_ENTITY,
            ...body,
          });
          apiResponse.body.data = await newEntity.save();
        } catch (error: any) {
          apiResponse.status = 500;
          apiResponse.body.message = error.message;
        }

        res.status(apiResponse.status).json(apiResponse.body);
      })
      .get(async (req: Request, res: Response) => {
        const headers = req.headers;
        const params = req.params;
        const query = req.query;
        const body = req.body;
        res.send({
          data: await entityModel.find(),
        });
      });
    entityRouter
      .route(`/${entityName}/:id`)
      .get(async (req: Request, res: Response) => {
        const headers = req.headers;
        const { id } = req.params;
        const query = req.query;
        const body = req.body;
        res.send({
          data: await entityModel.findById(id),
        });
      })
      .patch(async (req: Request, res: Response) => {
        const headers = req.headers;
        const { id } = req.params;
        const query = req.query;
        const body = req.body;
        res.send({
          data: await entityModel.findByIdAndUpdate(id, body, { new: true }),
        });
      });
    logger.info("----- Entity API -----");
    CommonUtility.displayRegisteredRouterPaths(entityRouter, "/entity");
  });

export default entityRouter;
