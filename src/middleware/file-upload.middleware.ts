import { NextFunction, Request, Response } from "express";
import path from "path";
import { ApiResponse } from "../api/api.router";
import config from "../config/config";
import logger from "../util/logger/logger";

export const fileUploadMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.files) {
    res.locals.files = [];
    Object.entries(req.files).forEach(([key, file]: [string, any]) => {
      const uploadFile =
        config.rootDir +
        path.sep +
        "temp" +
        path.sep +
        "files" +
        path.sep +
        file.name;
      res.locals.files.push(uploadFile);
      try {
        file.mv(uploadFile);
        next();
      } catch (error: any) {
        const response: ApiResponse = {
          status: 500,
          body: { message: error.message, data: error },
        };
        logger.error({ message: error.message, stack: error.stack });
        res.status(response.status).send(response.body);
      }
    });
  }
};
