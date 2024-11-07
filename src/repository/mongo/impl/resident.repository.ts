import ResidentEntity from "../../../entity/mongo/impl/resident.entity";
import { TBasicMongoEntity } from "../../../entity/mongo/mongo.entity";
import MongoRepository from "../mongo.repository";

export default class ResidentRepository extends MongoRepository<
  TBasicMongoEntity,
  ResidentEntity
> {
  async readAndJoinFlat(options?: any) {
    return this.mongoModel!.find().populate("flatId");
  }
}
