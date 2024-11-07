import ProviderEntity from "../../../entity/mongo/impl/provider.entity";
import { TBasicMongoEntity } from "../../../entity/mongo/mongo.entity";
import MongoRepository from "../mongo.repository";

export default class ProviderRepository extends MongoRepository<
  TBasicMongoEntity,
  ProviderEntity
> {
  async readWithFilter(filter: any): Promise<ProviderEntity[]> {
    return (await this.mongoModel!.find(filter)) as unknown as Promise<
      ProviderEntity[]
    >;
  }
}
