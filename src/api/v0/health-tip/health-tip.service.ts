import HealthTipEntity from "../../../entity/mongo/impl/health-tip.entity";
import HealthTipRepository from "../../../repository/mongo/impl/health-tip.repository";
import logger from "../../../util/logger/logger";

export default class HealthTipService {
  private repository: HealthTipRepository;

  constructor() {
    this.repository = new HealthTipRepository(new HealthTipEntity({}));
  }

  async addHealthTip(healthTip: any) {
    logger.debug(`Adding health tips for the users`);
    const newHealthTip = await this.repository.create(healthTip);
    return newHealthTip;
  }

  async getHealthTips(healthTip: any) {
    logger.debug(`Health Tips: getHealtTips ${healthTip}`);
    return await this.repository.readWithFilter({ title: { $ne: null } });
  }
}
