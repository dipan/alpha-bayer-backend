import { Request, Response, Router } from "express";
import logger from "../../../util/logger/logger";
import StringUtility from "../../../util/string.utility";
import { ApiResponse } from "../../api.router";
import SuperAdminService from "./superadmin.service";

const superadminRouter: Router = Router();
const service = new SuperAdminService();

superadminRouter
  .route("/user-signup")
  .post(async (req: Request, res: Response) => {
    const params = req.params;
    const query = req.query;
    const { username } = req.headers;
    const body = req.body;
    const response: ApiResponse = { status: 200, body: { message: "OK" } };
    try {
      if (StringUtility.isEmptyOrNull(String(username))) {
        response.status = 400;
        response.body.message = "Required Fields Missing";
        response.body.data = {
          field: "username",
          parameter: "header",
        };
      } else {
        response.body.data = await service.userSignUp(username);
        response.body.message = "User added successfully";
        response.status = 201;
      }
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
    const { origin } = req.headers;
    const body = req.body;
    const response: ApiResponse = { status: 200, body: { message: "OK" } };
    try {
      // response.body.data = await service.getUsers({});
      response.body.message = "Residents retrieved successfully";
      response.status = 200;
    } catch (error) {
      logger.error(error);
      response.status = 500;
      response.body.message = "Error occurred retriving residents";
      response.body.data = error;
    }
    res.status(response.status).send(response.body);
  });

export default superadminRouter;
