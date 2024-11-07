import moment from "moment";
import IMongoEntity, { TBasicMongoEntity } from "../mongo.entity";
import mongoose, { Model, Schema } from "mongoose";

interface TModelClient extends TBasicMongoEntity, Document {
  name: { type: String };
  timezone: { type: String };
  techStcak: { type: [String] };
}

const mongoSchema = new Schema<TModelClient>({
  name: { type: String },
  timezone: { type: String },
  techStcak: { type: [String] },
  createdAt: { type: Number },
  createdBy: { type: String },
  updatedAt: { type: Number },
  updatedBy: { type: String },
});

const mongoModel = mongoose.model<TModelClient>("clients", mongoSchema);

export default class ClientEntity implements IMongoEntity {
  _id: string;
  createdAt: number;
  createdBy: string | undefined;
  updatedAt: number;
  updatedBy: string | undefined;
  [key: string]: any;

  constructor(user: Partial<TBasicMongoEntity>) {
    const { id, createdBy, updatedBy, name, timezone, techStcak } = user ?? {};
    this._id = id;
    this.createdAt = moment().milliseconds();
    this.createdBy = createdBy;
    this.updatedAt = moment().milliseconds();
    this.updatedBy = updatedBy;
    this.name = name;
    this.timezone = timezone;
    this.techStcak = techStcak;
  }

  getSchema(): mongoose.Schema<
    any,
    mongoose.Model<any, any, any, any, any, any>,
    {},
    {},
    {},
    {},
    mongoose.DefaultSchemaOptions,
    { [x: string]: any },
    mongoose.Document<unknown, {}, mongoose.FlatRecord<{ [x: string]: any }>> &
      Omit<
        mongoose.FlatRecord<{ [x: string]: any }> & Required<{ _id: unknown }>,
        never
      >
  > {
    return mongoSchema;
  }

  getModel(): any {
    return mongoModel;
  }
}
