import { Request, Response, Router } from "express";
import EmailService from "./email.service";
import { ApiResponse } from "../../api.router";
import logger from "../../../util/logger/logger";
import { IncomingHttpHeaders } from "http";
import config from "../../../config/config";

const emailRouter: Router = Router();
const service = new EmailService();

const allowedOrigins: string[] = config.allowedOrigins;

emailRouter.route("").post(async (req: Request, res: Response) => {
  const headers: IncomingHttpHeaders = req.headers;
  const params = req.params;
  const { name, email, subject } = req.query;
  const body = req.body;
  const response: ApiResponse = { status: 200, body: { message: "OK" } };
  try {
    if (!allowedOrigins.some((origin) => headers.origin?.includes(origin))) {
      response.body.message =
        "Origin not registered! Please contact info@dipan.dev";
      response.body.data = {
        message: "Resgister your domain with us to continue using this service",
      };
    } else if (!name) {
      response.status = 400;
      response.body.message = "Required Field Missing";
      response.body.data = { field: "name" };
    } else if (!email) {
      response.status = 400;
      response.body.message = "Required Field Missing";
      response.body.data = { field: "email" };
    } else if (!subject) {
      response.status = 400;
      response.body.message = "Required Field Subject";
      response.body.data = { field: "subject" };
    } else {
      await service.sendEmail(
        name.toString(),
        email.toString(),
        subject.toString(),
        body.html,
        body.sender,
        body.replyTo
      );
      response.body.message = "EMail sent successfully";
    }
  } catch (error) {
    logger.error(error);
    response.status = 500;
    response.body.message = "Error occurred while sending email";
    response.body.data = error;
  }
  res.status(response.status).send(response.body);
});

export default emailRouter;
