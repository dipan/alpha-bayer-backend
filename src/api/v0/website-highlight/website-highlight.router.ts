import { Request, Response, Router } from "express";
import logger from "../../../util/logger/logger";
import StringUtility from "../../../util/string.utility";
import { ApiResponse } from "../../api.router";
import WebsiteHighlightService from "./website-highlight.service";
import { URL } from "url";
import config from "../../../config/config";

const websiteHighlightRouter: Router = Router();
const service = new WebsiteHighlightService();

const allowedOrigins: string[] = config.allowedOrigins;

websiteHighlightRouter
  .route("")
  .post(async (req: Request, res: Response) => {
    logger.debug("POST websiteHighlightRouter(/)");
    const params = req.params;
    const query = req.query;
    const { origin } = req.headers;
    const body = req.body;
    const response: ApiResponse = { status: 200, body: { message: "OK" } };
    const parsedOrigin = new URL(origin ?? "");
    try {
      if (
        !allowedOrigins.some((allowedOrigin) =>
          allowedOrigin?.includes(parsedOrigin.host)
        )
      ) {
        response.body.message =
          "Origin not registered! Please contact info@dipan.dev";
        response.body.data = {
          message:
            "Resgister your domain with us to continue using this service",
        };
      } else if (
        StringUtility.isEmptyOrNull(body.text) &&
        StringUtility.isEmptyOrNull(body.image)
      ) {
        response.status = 400;
        response.body.message = "Required Fields Missing";
        response.body.data = { field: "text, image", parameter: "body" };
      } else {
        response.body.data = await service.addWebsiteHighlight(
          parsedOrigin.host ?? "",
          {
            text: body.text,
            image: body.image,
            isImportant: body.isImportant,
          }
        );
        response.body.message = "Highlight added successfully";
        response.status = 201;
      }
    } catch (error) {
      logger.error(error);
      response.status = 500;
      response.body.message = "Error occurred adding highlight";
      response.body.data = error;
    }
    res.status(response.status).send(response.body);
  })
  .get(async (req: Request, res: Response) => {
    logger.debug("GET websiteHighlightRouter(/)");
    const params = req.params;
    const query = req.query;
    const { origin } = req.headers;
    const body = req.body;
    const parsedOrigin = new URL(origin ?? "");
    const response: ApiResponse = { status: 200, body: { message: "OK" } };
    try {
      if (
        !allowedOrigins.some((allowedOrigin) =>
          allowedOrigin?.includes(parsedOrigin.host)
        )
      ) {
        response.body.message =
          "Origin not registered! Please contact info@dipan.dev";
        response.body.data = {
          message:
            "Resgister your domain with us to continue using this service",
        };
      } else {
        response.body.data = await service.getWebsiteHighlightsByOrigin(
          parsedOrigin.host ?? ""
        );
        response.body.message = "Highlight retrieved successfully";
        response.status = 200;
      }
    } catch (error) {
      logger.error(error);
      response.status = 500;
      response.body.message = "Error occurred retriving highlight";
      response.body.data = error;
    }
    res.status(response.status).send(response.body);
  });

websiteHighlightRouter
  .route("/:index")
  .delete(async (req: Request, res: Response) => {
    logger.debug("DELETE websiteHighlightRouter(/:index)");
    const { index } = req.params;
    const query = req.query;
    const { origin } = req.headers;
    const body = req.body;
    const parsedOrigin = new URL(origin ?? "");
    const response: ApiResponse = { status: 200, body: { message: "OK" } };
    try {
      if (
        !allowedOrigins.some((allowedOrigin) =>
          allowedOrigin?.includes(parsedOrigin.host)
        )
      ) {
        response.body.message =
          "Origin not registered! Please contact info@dipan.dev";
        response.body.data = {
          message:
            "Resgister your domain with us to continue using this service",
        };
      } else {
        response.body.data = await service.deleteWebsiteHighlightByOrigin(
          parsedOrigin.host ?? "",
          Number(index)
        );
        response.body.message = "Highlight deleted successfully";
        response.status = 200;
      }
    } catch (error) {
      logger.error(error);
      response.status = 500;
      response.body.message = "Error occurred while deleting highlight";
      response.body.data = error;
    }
    res.status(response.status).send(response.body);
  });

export default websiteHighlightRouter;
