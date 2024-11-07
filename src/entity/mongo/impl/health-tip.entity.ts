import moment from "moment";
import mongoose, { Schema } from "mongoose";
import IMongoEntity, { TBasicMongoEntity } from "../mongo.entity";

interface TModelHealthTip extends TBasicMongoEntity, Document {
  name: { type: String };
  description: { type: String };
  minAge: { type: Number };
  maxAge: { type: Number };
}

const mongoSchema = new Schema<TModelHealthTip>({
  name: { type: String },
  description: { type: String },
  minAge: { type: Number },
  maxAge: { type: Number },
  createdAt: { type: Number },
  createdBy: { type: String },
  updatedAt: { type: Number },
  updatedBy: { type: String },
});

const mongoModel = mongoose.model<TModelHealthTip>("health_tips", mongoSchema);

export default class HealthTipEntity implements IMongoEntity {
  _id: string;
  createdAt: number;
  createdBy: string | undefined;
  updatedAt: number;
  updatedBy: string | undefined;
  [key: string]: any;
  name: string;
  description: string;
  minAge: number;
  maxAge: number;

  constructor(healthTip: Partial<TBasicMongoEntity>) {
    const { id, createdBy, updatedBy, name, description, minAge, maxAge } =
      healthTip ?? {};
    this._id = id;
    this.createdAt = moment().milliseconds();
    this.createdBy = createdBy;
    this.updatedAt = moment().milliseconds();
    this.updatedBy = updatedBy;
    this.name = name;
    this.description = description;
    this.minAge = minAge;
    this.maxAge = maxAge;
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
