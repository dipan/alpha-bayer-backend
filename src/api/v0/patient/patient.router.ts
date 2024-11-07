import { Request, Response, Router } from "express";
import logger from "../../../util/logger/logger";
import { ApiResponse } from "../../api.router";
import PatientService from "./patient.service";
import { USER_ROLE } from "../../../entity/mongo/impl/user.entity";

const patientRouter: Router = Router();
const service = new PatientService();

patientRouter.route("").get(async (req: Request, res: Response) => {
  const tokenPayload = res.locals.tokenPayload;
  const allowedUserRole = USER_ROLE.PROVIDER;
  const response: ApiResponse = { status: 200, body: { message: "OK" } };
  if (tokenPayload.role === allowedUserRole) {
    try {
      response.body.data = await service.getPatients({});
      response.body.message = "Patients retrieved successfully";
      response.status = 200;
    } catch (error) {
      logger.error(error);
      response.status = 500;
      response.body.message = "Error occurred retriving patients";
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

patientRouter
  .route("/:id")
  .patch(async (req: Request, res: Response) => {
    const { id: patientId } = req.params;
    const body = req.body;
    const response: ApiResponse = { status: 200, body: { message: "OK" } };
    try {
      response.body.data = await service.updatePatientById(patientId, body);
      response.body.message = "Patient updated successfully";
      response.status = 200;
    } catch (error) {
      logger.error(error);
      response.status = 500;
      response.body.message = "Error occurred updating Patient";
      response.body.data = error;
    }
    res.status(response.status).send(response.body);
  })
  .get(async (req: Request, res: Response) => {
    const { id: patientId } = req.params;
    const response: ApiResponse = { status: 200, body: { message: "OK" } };
    try {
      response.body.data = await service.findByPatientId(patientId);
      response.body.message = "Patient retrieved successfully";
      response.status = 200;
    } catch (error) {
      logger.error(error);
      response.status = 500;
      response.body.message = "Error occurred while retrieving patient";
      response.body.data = error;
    }
    res.status(response.status).send(response.body);
  });

export default patientRouter;
