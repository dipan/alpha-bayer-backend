import { Request, Response, Router } from "express";
import logger from "../../../util/logger/logger";
import { ApiResponse } from "../../api.router";
import ProviderService from "./provider.service";
import { USER_ROLE } from "../../../entity/mongo/impl/user.entity";

const providerRouter: Router = Router();
const service = new ProviderService();

providerRouter.route("").get(async (req: Request, res: Response) => {
  const response: ApiResponse = { status: 200, body: { message: "OK" } };
  try {
    response.body.data = await service.getProviders({});
    response.body.message = "Providers retrieved successfully";
    response.status = 200;
  } catch (error) {
    logger.error(error);
    response.status = 500;
    response.body.message = "Error occurred retriving providers";
    response.body.data = error;
  }
  res.status(response.status).send(response.body);
});

providerRouter.route("/:id").get(async (req: Request, res: Response) => {
  const { id } = req.params;
  const response: ApiResponse = { status: 200, body: { message: "OK" } };
  try {
    response.body.data = await service.findByProviderId(id);
    response.body.message = "Provider retrieved successfully";
    response.status = 200;
  } catch (error) {
    logger.error(error);
    response.status = 500;
    response.body.message = "Error occurred while retrieving provider";
    response.body.data = error;
  }
  res.status(response.status).send(response.body);
});

export default providerRouter;
