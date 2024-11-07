import UserEntity from "../../../entity/mongo/impl/user.entity";
import { TBasicMongoEntity } from "../../../entity/mongo/mongo.entity";
import MongoRepository from "../mongo.repository";

export default class UserRepository extends MongoRepository<
  TBasicMongoEntity,
  UserEntity
> {
  async readWithFilter(filter: any): Promise<UserEntity[]> {
    return (await this.mongoModel!.find(filter)) as unknown as Promise<
      UserEntity[]
    >;
  }
}
