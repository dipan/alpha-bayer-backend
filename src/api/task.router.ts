import { Request, Response, Router } from "express";
import { ApiResponse } from "./api.router";
import TaskManager from "../task/task.manager.";
import logger from "../util/logger/logger";

const taskRouter: Router = Router();

taskRouter.route("").get(async (req: Request, res: Response) => {
  const response: ApiResponse = { status: 200, body: { message: "OK" } };
  try {
    response.body.data = TaskManager.getInstance().getAllJobs();
    response.body.message = "Jobs retrieved successfully";
    response.status = 200;
  } catch (error: any) {
    logger.error(error);
    response.status = 500;
    response.body.message = error.message;
    response.body.data = error.stack;
  }
  res.status(response.status).send(response.body);
});

taskRouter.route("/:id/start").post(async (req: Request, res: Response) => {
  const response: ApiResponse = { status: 200, body: { message: "OK" } };
  try {
    const { id } = req.params;
    const body = req.body;
    response.body.data = TaskManager.getInstance().startTask(id, body);
    response.body.message = "Task executed successfully";
    response.status = 200;
  } catch (error: any) {
    logger.error(error);
    response.status = 500;
    response.body.message = error.message;
    response.body.data = error.stack;
  }
  res.status(response.status).send(response.body);
});

export default taskRouter;
