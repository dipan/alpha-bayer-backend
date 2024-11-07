import FlatEntity from "../../../entity/mongo/impl/flat.entity";
import { TBasicMongoEntity } from "../../../entity/mongo/mongo.entity";
import MongoRepository from "../mongo.repository";

export default class FlatRepository extends MongoRepository<
  TBasicMongoEntity,
  FlatEntity
> {
  async readWithFilter(
    filter: any = {},
    projection: any = {},
    options: any = {}
  ): Promise<FlatEntity[]> {
    return (await this.mongoModel!.find(
      filter,
      projection,
      options
    )) as unknown as Promise<FlatEntity[]>;
  }

  async countBuildArea() {
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
