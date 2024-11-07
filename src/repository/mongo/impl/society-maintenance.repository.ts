import SocietyMaintenanceEntity from "../../../entity/mongo/impl/society-maintenance.entity";
import { TBasicMongoEntity } from "../../../entity/mongo/mongo.entity";
import MongoRepository from "../mongo.repository";

export default class SocietyMaintenanceRepository extends MongoRepository<
  TBasicMongoEntity,
  SocietyMaintenanceEntity
> {
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
