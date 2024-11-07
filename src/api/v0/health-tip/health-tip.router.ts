import { Request, Response, Router } from "express";
import logger from "../../../util/logger/logger";
import { ApiResponse } from "../../api.router";
import HealthTipService from "./health-tip.service";

const healthTipRouter: Router = Router();
const service = new HealthTipService();

healthTipRouter
  .route("/")
  .post(async (req: Request, res: Response) => {
    const body = req.body;
    const response: ApiResponse = { status: 200, body: { message: "OK" } };
    try {
      response.body.data = await service.addHealthTip({
        ...body,
      });
      response.body.message = "Health Tip added successfully";
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
    const tokenPayload = res.locals.tokenPayload;
    const response: ApiResponse = { status: 200, body: { message: "OK" } };
    try {
      response.body.data = await service.getHealthTips({
        id: tokenPayload.id,
        role: tokenPayload.role,
      });
      response.body.message = "Health Tips retrieved successfully";
      response.status = 200;
    } catch (error) {
      logger.error(error);
      response.status = 500;
      response.body.message = "Error occurred retriving health tips";
      response.body.data = error;
    }
    res.status(response.status).send(response.body);
  });

export default healthTipRouter;
