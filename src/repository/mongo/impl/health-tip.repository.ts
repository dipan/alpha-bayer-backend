import HealthTipEntity from "../../../entity/mongo/impl/health-tip.entity";
import { TBasicMongoEntity } from "../../../entity/mongo/mongo.entity";
import MongoRepository from "../mongo.repository";

export default class HealthTipRepository extends MongoRepository<
  TBasicMongoEntity,
  HealthTipEntity
> {
  async readWithFilter(filter: any): Promise<HealthTipEntity[]> {
    return (await this.mongoModel!.find(filter)) as unknown as Promise<
      HealthTipEntity[]
    >;
  }
}
