import moment from "moment";
import mongoose, { Model, Schema } from "mongoose";
import IMongoEntity, { TBasicMongoEntity } from "../mongo.entity";
import { TModelSociety } from "./society.entity";

export interface TModelBlock extends TBasicMongoEntity, Document {
  societyId: mongoose.Types.ObjectId | TModelSociety;
  name: { type: String };
  flats: { type: Number };
  parkingSpaces: { type: Number };
}

const mongoSchema = new Schema<TModelBlock>({
  societyId: { type: Schema.Types.ObjectId, ref: "society", required: true },
  name: { type: String },
  flats: { type: Number },
  parkingSpaces: { type: Number },
  createdAt: { type: Number },
  createdBy: { type: String },
  updatedAt: { type: Number },
  updatedBy: { type: String },
});

const mongoModel = mongoose.model<TModelBlock>("block", mongoSchema);

export default class BlockEntity implements IMongoEntity {
  _id: string;
  createdAt: number;
  createdBy: string | undefined;
  updatedAt: number;
  updatedBy: string | undefined;
  [key: string]: any;
  private name: string | undefined;
  private flats: number | undefined;
  private parkingSpaces: number | undefined;

  constructor(allowedOrigin: Partial<TBasicMongoEntity>) {
    const { id, createdBy, updatedBy, name, flats, parkingSpaces } =
      allowedOrigin ?? {};
    this._id = id;
    this.createdAt = moment().milliseconds();
    this.createdBy = createdBy;
    this.updatedAt = moment().milliseconds();
    this.updatedBy = updatedBy;

    this.name = name;
    this.flats = flats;
    this.parkingSpaces = parkingSpaces;
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
