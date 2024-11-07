import moment from "moment";
import mongoose, { Schema } from "mongoose";
import IMongoEntity, { TBasicMongoEntity } from "../mongo.entity";

interface TModelProvider extends TBasicMongoEntity, Document {
  providerId: { type: String };
  name: { type: String };
  email: { type: String };
  phone: { type: Number };
}

const mongoSchema = new Schema<TModelProvider>({
  providerId: { type: String },
  name: { type: String },
  email: { type: String },
  phone: { type: Number },
});

const mongoModel = mongoose.model<TModelProvider>("providers", mongoSchema);

export default class ProviderEntity implements IMongoEntity {
  _id: string;
  createdAt: number;
  createdBy: string | undefined;
  updatedAt: number;
  updatedBy: string | undefined;
  [key: string]: any;
  providerId: string;
  name: string;
  email: string;
  phone: number;

  constructor(provider: Partial<TBasicMongoEntity>) {
    const { id, createdBy, updatedBy, providerId, name, email, phone } =
      provider ?? {};
    this._id = id;
    this.createdAt = moment().milliseconds();
    this.createdBy = createdBy;
    this.updatedAt = moment().milliseconds();
    this.updatedBy = updatedBy;

    this.providerId = providerId;
    this.name = name;
    this.email = email;
    this.phone = phone;
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
