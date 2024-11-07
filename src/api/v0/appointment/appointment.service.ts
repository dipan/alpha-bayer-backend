import AppointmentEntity from "../../../entity/mongo/impl/appointment.entity";
import AppointmentRepository from "../../../repository/mongo/impl/appointment.repository";
import logger from "../../../util/logger/logger";

export default class AppointmentService {
  private repository: AppointmentRepository;

  constructor() {
    this.repository = new AppointmentRepository(new AppointmentEntity({}));
  }

  async addAppointment(appointment: any) {
    logger.debug(`Adding appointment for the patient ${appointment.patientId}`);
    const newAppointment = await this.repository.create(appointment);
    return newAppointment;
  }

  async getAppointments(userInfo: any) {
    logger.debug(`Appointments: getAppointments ${userInfo}`);
    const filter =
      userInfo.role === "PATIENT"
        ? {
            patientId: { $eq: userInfo.id },
          }
        : {
            providerId: { $eq: userInfo.id },
          };
    return await this.repository.read();
  }
}
