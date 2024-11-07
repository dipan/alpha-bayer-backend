import { Request, Response, Router } from "express";
import { URL } from "url";
import logger from "../../../util/logger/logger";
import StringUtility from "../../../util/string.utility";
import { ApiResponse } from "../../api.router";
import AuthService from "./auth.service";
import UserService from "../../v0/user/user.service";

const authRouter: Router = Router();
const service = new AuthService();
const userService = new UserService();

authRouter.route("/login").post(async (req: Request, res: Response) => {
  const params = req.params;
  const query = req.query;
  const headers = req.headers;
  const body = req.body;
  const response: ApiResponse = { status: 200, body: { message: "OK" } };
  try {
    response.body.data = await service.userLogin({ ...body, ...headers });
    response.body.message = "User logged in successfully";
    response.body.token = response.body.data.token;
    response.status = 200;
  } catch (error: any) {
    logger.error(error);
    response.status = 500;
    response.body.message = "Error occurred logging in user";
    response.body.data = error.message;
  }
  res.status(response.status).send(response.body);
});

authRouter
  .route("/register")
  .post(async (req: Request, res: Response) => {
    const params = req.params;
    const query = req.query;
    const headers = req.headers;
    const body = req.body;
    const response: ApiResponse = { status: 200, body: { message: "OK" } };
    try {
      if (!headers.email) {
        response.status = 400;
        response.body.message = "Required Field Missing";
        response.body.data = { field: "header.email" };
      } else if (!headers.password) {
        response.status = 400;
        response.body.message = "Required Field Missing";
        response.body.data = { field: "header.password" };
      } else {
        response.body.data = await userService.addUser({ ...body, ...headers });
        response.body.message = "User registered successfully";
        response.status = 200;
      }
    } catch (error: any) {
      logger.error(error);
      response.status = 500;
      response.body.message = "Error occurred while registering user";
      response.body.data = error.message;
    }
    res.status(response.status).send(response.body);
  })
  .patch(async (req: Request, res: Response) => {
    const params = req.params;
    const query = req.query;
    const headers = req.headers;
    const body = req.body;
    const response: ApiResponse = { status: 200, body: { message: "OK" } };
    try {
      response.body.data = await service.userLogin(headers);
      response.body.message = "User retrieved successfully";
      response.status = 200;
    } catch (error: any) {
      logger.error(error);
      response.status = 500;
      response.body.message = "Error occurred logging in user";
      response.body.data = error.message;
    }
    res.status(response.status).send(response.body);
  });

authRouter.patch("/set-password", async (req: Request, res: Response) => {
  const { id } = req.params;
  const query = req.query;
  const headers = req.headers;
  const body = req.body;
  const response: ApiResponse = { status: 200, body: { message: "OK" } };
  try {
    response.body.data = await service.userSetPassword(headers);
    response.body.message = "Password set successfully";
    response.status = 200;
  } catch (error: any) {
    logger.error(error);
    response.status = 500;
    response.body.message = "Error updating user password";
    response.body.data = error.message;
  }
  res.status(response.status).send(response.body);
});

export default authRouter;
