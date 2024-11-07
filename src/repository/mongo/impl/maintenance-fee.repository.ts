import MaintenanceFeeEntity from "../../../entity/mongo/impl/maintenance-fee.entity";
import { TBasicMongoEntity } from "../../../entity/mongo/mongo.entity";
import MongoRepository from "../mongo.repository";

export default class MaintenanceFeeRepository extends MongoRepository<
  TBasicMongoEntity,
  MaintenanceFeeEntity
> {
  async readAndJoinFlat(filter: any = {}) {
    return await this.mongoModel!.find(filter).populate("flatId");
  }

  async countWithFilter() {
    const countResult = await this.mongoModel!.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: "$buildArea" },
        },
      },
    ]);
    return countResult;
  }
}
