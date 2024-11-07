import { Document, Model } from "mongoose";
import IMongoEntity, {
  DEFAULT_BASIC_MONGO_ENTITY,
  TBasicMongoEntity,
} from "../../entity/mongo/mongo.entity";
import IRepository from "../repository";

export default class MongoRepository<
  T extends TBasicMongoEntity,
  E extends IMongoEntity
> implements IRepository<T>
{
  protected mongoModel: Model<Document> | undefined = undefined;
  constructor(mongoEntity: E) {
    if (mongoEntity) {
      this.mongoModel = mongoEntity.getModel();
    }
  }

  async create(entity: T): Promise<T> {
    const newModel = new this.mongoModel!({
      ...DEFAULT_BASIC_MONGO_ENTITY,
      ...entity,
    });
    return (await newModel.save()) as unknown as Promise<T>;
  }

  async read(): Promise<T[]> {
    return (await this.mongoModel!.find()) as unknown as Promise<T[]>;
  }

  async readById(id: string | number): Promise<T> {
    return (await this.mongoModel!.findById(id)) as unknown as Promise<T>;
  }

  async updateById(id: string | number, entity: T): Promise<T> {
    return (await this.mongoModel!.findByIdAndUpdate(id, entity, {
      new: true,
    })) as unknown as Promise<T>;
  }

  async deleteById(id: string | number): Promise<T> {
    return (await this.mongoModel!.findByIdAndDelete(
      id
    )) as unknown as Promise<T>;
  }

  async findOne(field: string, value: any): Promise<T> {
    return (await this.mongoModel!.findOne({
      [field]: value,
    })) as unknown as Promise<T>;
  }

  async findWithFilter(
    filter: any = {},
    projection: { [key: string]: boolean } = {},
    options: any = {}
  ): Promise<T> {
    const _projection: { [key: string]: boolean } = {};
    for (const [key, value] of Object.entries(projection).filter(
      (field) => field[1]
    )) {
      _projection[key] = value;
    }
    return (await this.mongoModel!.find(
      filter,
      _projection,
      options
    )) as unknown as Promise<T>;
  }

  async update(filter: any, update: any): Promise<T> {
    return (await this.mongoModel!.updateMany(filter, update, {
      new: true,
      multi: true,
    })) as unknown as Promise<T>;
  }
}
