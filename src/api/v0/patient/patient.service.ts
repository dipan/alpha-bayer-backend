import PatientEntity from "../../../entity/mongo/impl/patient.entity";
import { TBasicMongoEntity } from "../../../entity/mongo/mongo.entity";
import PatientRepository from "../../../repository/mongo/impl/patient.repository";
import logger from "../../../util/logger/logger";

export default class PatientService {
  private repository: PatientRepository;

  constructor() {
    this.repository = new PatientRepository(new PatientEntity({}));
  }

  async getPatients(options: any) {
    logger.debug(`PatientService: getPatients ${options}`);
    return await this.repository.readWithFilter({
      patientId: { $ne: null },
    });
  }

  async updatePatientById(patientId: string, patientInfo: any) {
    logger.debug(`UPDATE: updatePatientById for ${patientId}`);
    return await this.repository.updateById(patientId, patientInfo);
  }

  async findByPatientId(patientId: string): Promise<TBasicMongoEntity> {
    return await this.repository.findOne("patientId", patientId);
  }
}
