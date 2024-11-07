import { Request, Response, Router } from "express";
import logger from "../../../util/logger/logger";
import { ApiResponse } from "../../api.router";
import FlatService from "../../v0/flat/flat.service";

const flatRouter: Router = Router();
const service = new FlatService();

flatRouter.route("").get(async (req: Request, res: Response) => {
  const params = req.params;
  const query = req.query;
  const { origin } = req.headers;
  const body = req.body;
  const response: ApiResponse = { status: 200, body: { message: "OK" } };
  service.tokenPayload = res.locals.tokenPayload;
  try {
    const flatDetailsFromDb = await service.getPublicFlats();
    response.body.data = flatDetailsFromDb.data;
    response.body.meta = flatDetailsFromDb.meta;
    response.body.message = "Flats retrieved successfully";
    response.status = 200;
  } catch (error) {
    logger.error(error);
    response.status = 500;
    response.body.message = "Error occurred retriving flats";
    response.body.data = error;
  }
  res.status(response.status).send(response.body);
});

export default flatRouter;
