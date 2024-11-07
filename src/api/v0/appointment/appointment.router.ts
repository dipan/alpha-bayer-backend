import { Request, Response, Router } from "express";
import logger from "../../../util/logger/logger";
import { ApiResponse } from "../../api.router";
import AppointmentService from "./appointment.service";

const appointmentRouter: Router = Router();
const service = new AppointmentService();

appointmentRouter
  .route("/appointment")
  .post(async (req: Request, res: Response) => {
    const body = req.body;
    const response: ApiResponse = { status: 200, body: { message: "OK" } };
    try {
      response.body.data = await service.addAppointment({
        ...body,
      });
      response.body.message = "Appointment booked successfully";
      response.status = 201;
    } catch (error: any) {
      logger.error({ message: error.message, stack: error.stack });
      response.status = 500;
      response.body.message = error.message;
      response.body.data = error;
    }
    res.status(response.status).send(response.body);
  })
  .get(async (req: Request, res: Response) => {
    const tokenPayload = res.locals.tokenPayload;
    const response: ApiResponse = { status: 200, body: { message: "OK" } };
    try {
      response.body.data = await service.getAppointments({
        id: tokenPayload.id,
        role: tokenPayload.role,
      });
      response.body.message = "Appointments retrieved successfully";
      response.status = 200;
    } catch (error) {
      logger.error(error);
      response.status = 500;
      response.body.message = "Error occurred retriving appointments";
      response.body.data = error;
    }
    res.status(response.status).send(response.body);
  });

export default appointmentRouter;
