import PatientEntity from "../../../entity/mongo/impl/patient.entity";
import { TBasicMongoEntity } from "../../../entity/mongo/mongo.entity";
import MongoRepository from "../mongo.repository";

export default class PatientRepository extends MongoRepository<
  TBasicMongoEntity,
  PatientEntity
> {
  async readWithFilter(filter: any): Promise<PatientEntity[]> {
    return (await this.mongoModel!.find(filter)) as unknown as Promise<
      PatientEntity[]
    >;
  }
}
