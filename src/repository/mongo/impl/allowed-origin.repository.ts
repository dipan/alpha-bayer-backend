import AllowedOriginEntity from "../../../entity/mongo/impl/allowed-origin.entity";
import { TBasicMongoEntity } from "../../../entity/mongo/mongo.entity";
import MongoRepository from "../mongo.repository";

export default class AllowedOriginRepository extends MongoRepository<
  TBasicMongoEntity,
  AllowedOriginEntity
> {}
