import { Request, Response, Router } from "express";
import SecurityUtility from "../../util/security/securityUtility";
import CommonUtility from "../../util/commonUtility";
import UserNotification from "../../notification/notification";
import BrevoEmailNotification from "../../notification/impl/brevoEmail.notification";
import logger from "../../util/logger/logger";
import { ApiResponse } from "../api.router";
import StringUtility from "../../util/string.utility";
import GoogleMailNotification from "../../notification/impl/googleMail.notification";

const publicRouter: Router = Router();

publicRouter.route("/test-email").post(async (req: Request, res: Response) => {
  const headers = req.headers;
  const params = req.params;
  const { name, email, subject } = req.query;
  const body = req.body;
  const response: ApiResponse = { status: 200, body: { message: "OK" } };

  try {
    if (!name) {
      response.status = 400;
      response.body.message = "Required Field Missing";
      response.body.data = { field: "name" };
    } else if (!email) {
      response.status = 400;
      response.body.message = "Required Field Missing";
      response.body.data = { field: "email" };
    } else {
      const notification: UserNotification = new GoogleMailNotification({
        to: { name: name.toString(), address: email.toString() },
        subject: subject?.toString(),
      });
      response.body.data = await notification.notify();
      response.body.message = "EMail sent successfully";
    }
  } catch (error) {
    logger.error(error);
  }
  res.status(response.status).send(response.body);
});

publicRouter.route("/task/{id}").patch(async (req: Request, res: Response) => {
  const headers = req.headers;
  const params = req.params;
  const { name, email } = req.query;
  const body = req.body;
  const response: ApiResponse = { status: 200, body: { message: "OK" } };

  try {
    if (!name) {
      response.status = 400;
      response.body.message = "Required Field Missing";
      response.body.data = { field: "name" };
    } else if (!email) {
      response.status = 400;
      response.body.message = "Required Field Missing";
      response.body.data = { field: "email" };
    } else {
      const notification: UserNotification = new BrevoEmailNotification(
        [{ name: name.toString(), email: email.toString() }],
        `Your otp is: ${SecurityUtility.generateOTP(8)}`
      );
      response.body.message = "EMail sent successfully";
      response.body.data = await notification.notify();
    }
  } catch (error) {
    logger.error(error);
  }
  res.status(response.status).send(response.body);
});

publicRouter
  .route("/enable-debug")
  .post(async (req: Request, res: Response) => {
    const headers = req.headers;
    const params = req.params;
    const { time } = req.query;
    const body = req.body;
    const response: ApiResponse = { status: 200, body: { message: "OK" } };

    try {
      if (StringUtility.isEmptyOrNull(String(time))) {
        response.body.message = "Invalid time";
      } else {
        CommonUtility.enableDebugLog(Number(time));
        response.body.message = `Debug logs enabled for ${time} milliseconds`;
      }
    } catch (error) {
      logger.error(error);
    }
    res.status(response.status).send(response.body);
  });

CommonUtility.displayRegisteredRouterPaths(publicRouter, "/public");

export default publicRouter;
