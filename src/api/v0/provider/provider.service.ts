import ProviderEntity from "../../../entity/mongo/impl/provider.entity";
import { TBasicMongoEntity } from "../../../entity/mongo/mongo.entity";
import ProviderRepository from "../../../repository/mongo/impl/provider.repository";
import logger from "../../../util/logger/logger";

export default class ProviderService {
  private repository: ProviderRepository;

  constructor() {
    this.repository = new ProviderRepository(new ProviderEntity({}));
  }

  async getProviders(options: any) {
    logger.debug(`PatientService: getPatients ${options}`);
    return await this.repository.readWithFilter({
      patientId: { $ne: null },
    });
  }

  async findByProviderId(providerId: string): Promise<TBasicMongoEntity> {
    return await this.repository.findOne("providerId", providerId);
  }
}
