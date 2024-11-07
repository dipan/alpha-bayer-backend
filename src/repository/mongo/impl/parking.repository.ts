import ParkingEntity, {
  Vehicle,
} from "../../../entity/mongo/impl/parking.entity";
import { TBasicMongoEntity } from "../../../entity/mongo/mongo.entity";
import MongoRepository from "../mongo.repository";

export default class ParkingRepository extends MongoRepository<
  TBasicMongoEntity,
  ParkingEntity
> {
  async updateById(id: string, updateQuery: any): Promise<ParkingEntity> {
    return (await this.mongoModel!.findByIdAndUpdate(id, updateQuery, {
      new: true,
    })) as unknown as Promise<ParkingEntity>;
  }

  async updateVehicles(
    parkingId: string,
    vehicles: Vehicle[]
  ): Promise<ParkingEntity> {
    return (await this.mongoModel!.updateOne(
      { _id: parkingId },
      { $set: { vehicles } },
      { new: true }
    )) as unknown as Promise<ParkingEntity>;
  }

  async readWithFilter(
    filter: any = {},
    projection: any = {},
    options: any = {}
  ): Promise<ParkingEntity[]> {
    return (await this.mongoModel!.find(
      filter,
      projection,
      options
    )) as unknown as Promise<ParkingEntity[]>;
  }
}
