import AppointmentEntity from "../../../entity/mongo/impl/appointment.entity";
import { TBasicMongoEntity } from "../../../entity/mongo/mongo.entity";
import MongoRepository from "../mongo.repository";

export default class AppointmentRepository extends MongoRepository<
  TBasicMongoEntity,
  AppointmentEntity
> {
  async readWithFilter(filter: any): Promise<AppointmentEntity[]> {
    return (await this.mongoModel!.find(filter)) as unknown as Promise<
      AppointmentEntity[]
    >;
  }
}
