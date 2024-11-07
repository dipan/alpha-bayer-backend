import SocietyEntity from "../../../entity/mongo/impl/society.entity";
import { TBasicMongoEntity } from "../../../entity/mongo/mongo.entity";
import MongoRepository from "../mongo.repository";

export default class SocietyRepository extends MongoRepository<
  TBasicMongoEntity,
  SocietyEntity
> {}
