import { Request, Response, Router } from "express";
import { fileUploadMiddleware } from "../../../middleware/file-upload.middleware";
import logger from "../../../util/logger/logger";
import StringUtility from "../../../util/string.utility";
import { ApiResponse } from "../../api.router";
import CloudinaryService from "./cloudinary.service";

const cloudinaryRouter: Router = Router();
const service = new CloudinaryService();

cloudinaryRouter
  .route("")
  .post(fileUploadMiddleware, async (req: Request, res: Response) => {
    const params = req.params;
    const query = req.query;
    const headers = req.headers;
    const body = req.body;
    const response: ApiResponse = { status: 200, body: { message: "OK" } };
    try {
      response.body.message = "File uplodaed to cloudinary successfully";
      response.body.data = service.uploadFile(res.locals.files[0]);
      response.status = 201;
    } catch (error: any) {
      logger.error({ message: error.message, stack: error.stack });
      response.status = 500;
      response.body.message = error.message;
      response.body.data = error;
    }
    res.status(response.status).send(response.body);
  })
  .get(async (req: Request, res: Response) => {
    const params = req.params;
    const query = req.query;
    const headers = req.headers;
    const body = req.body;
    const response: ApiResponse = { status: 200, body: { message: "OK" } };
    try {
      response.body.data = await service.getFiles();
      response.body.message = "Cloudinary resources retrieved successfully";
      response.status = 200;
    } catch (error) {
      logger.error(error);
      response.status = 500;
      response.body.message = "Error occurred retriving cloudinary resources";
      response.body.data = error;
    }
    res.status(response.status).send(response.body);
  });

export default cloudinaryRouter;
