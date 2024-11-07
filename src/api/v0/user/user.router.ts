import { Request, Response, Router } from "express";
import { URL } from "url";
import logger from "../../../util/logger/logger";
import StringUtility from "../../../util/string.utility";
import { ApiResponse } from "../../api.router";
import UserService from "./user.service";
import { USER_ROLE } from "../../../entity/mongo/impl/user.entity";

const userRouter: Router = Router();
const service = new UserService();

userRouter
  .route("")
  .post(async (req: Request, res: Response) => {
    const params = req.params;
    const query = req.query;
    const headers = req.headers;
    const body = req.body;
    const response: ApiResponse = { status: 200, body: { message: "OK" } };
    try {
      if (StringUtility.isEmptyOrNull(String(headers.username))) {
        response.status = 400;
        response.body.message = "Required Fields Missing";
        response.body.data = {
          field: "username",
          parameter: "header",
        };
      } else {
        response.body.data = await service.addUser({ ...body, ...headers });
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
    const tokenPayload = res.locals.tokenPayload;
    const allowedUserRole = USER_ROLE.PROVIDER;
    const response: ApiResponse = { status: 200, body: { message: "OK" } };
    if (tokenPayload.roles.includes(allowedUserRole)) {
      try {
        response.body.data = await service.getUsers({});
        response.body.message = "Residents retrieved successfully";
        response.status = 200;
      } catch (error) {
        logger.error(error);
        response.status = 500;
        response.body.message = "Error occurred retriving residents";
        response.body.data = error;
      }
    } else {
      response.status = 401;
      response.body = {
        code: 401001,
        message: "User is not authorized to access this resource",
      };
    }
    res.status(response.status).send(response.body);
  });

userRouter
  .route("/:id")
  .patch(async (req: Request, res: Response) => {
    const { id } = req.params;
    const query = req.query;
    const { origin } = req.headers;
    const body = req.body;
    const response: ApiResponse = { status: 200, body: { message: "OK" } };
    try {
      response.body.data = await service.updateUserById(id, body);
      response.body.message = "User updated successfully";
      response.status = 200;
    } catch (error) {
      logger.error(error);
      response.status = 500;
      response.body.message = "Error occurred updating user";
      response.body.data = error;
    }
    res.status(response.status).send(response.body);
  })
  .delete(async (req: Request, res: Response) => {
    const { id } = req.params;
    const query = req.query;
    const { origin } = req.headers;
    const body = req.body;
    const response: ApiResponse = { status: 200, body: { message: "OK" } };
    try {
      response.body.data = await service.deletUserById(id);
      response.body.message = "User deleted successfully";
      response.status = 200;
    } catch (error) {
      logger.error(error);
      response.status = 500;
      response.body.message = "Error occurred deleting user";
      response.body.data = error;
    }
    res.status(response.status).send(response.body);
  });

userRouter.route("/session").get(async (req: Request, res: Response) => {
  const params = req.params;
  const query = req.query;
  const { origin } = req.headers;
  const body = req.body;
  const tokenPayload = res.locals.tokenPayload;
  const response: ApiResponse = { status: 200, body: { message: "OK" } };
  try {
    response.body.data = tokenPayload;
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

export default userRouter;
