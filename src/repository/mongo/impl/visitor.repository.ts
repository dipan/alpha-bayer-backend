import VisitorEntity from "../../../entity/mongo/impl/visitor.entity";
import { TBasicMongoEntity } from "../../../entity/mongo/mongo.entity";
import MongoRepository from "../mongo.repository";

export default class VisitorRepository extends MongoRepository<
  TBasicMongoEntity,
  VisitorEntity
> {}
