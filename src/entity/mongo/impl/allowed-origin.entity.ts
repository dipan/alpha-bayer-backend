import moment from "moment";
import mongoose, { Model, Schema } from "mongoose";
import IMongoEntity, { TBasicMongoEntity } from "../mongo.entity";

interface Highlight {
  text: string;
  image: string;
  isImportant: boolean;
}
interface TModelAllowedOrigin extends TBasicMongoEntity, Document {
  origin: { type: String };
  highlights: { type: [Highlight] };
}

const highlightSchema = new Schema<Highlight>({
  text: { type: String },
  image: { type: String },
  isImportant: { type: Boolean },
});
const mongoSchema = new Schema<TModelAllowedOrigin>({
  origin: { type: String },
  highlights: { type: [highlightSchema] },
  createdAt: { type: Number },
  createdBy: { type: String },
  updatedAt: { type: Number },
  updatedBy: { type: String },
});

const mongoModel = mongoose.model<TModelAllowedOrigin>(
  "allowed_origins",
  mongoSchema
);

export default class AllowedOriginEntity implements IMongoEntity {
  _id: string;
  createdAt: number;
  createdBy: string | undefined;
  updatedAt: number;
  updatedBy: string | undefined;
  [key: string]: any;
  private origin: string | undefined;
  private highlights: string[] | undefined;

  constructor(allowedOrigin: Partial<TBasicMongoEntity>) {
    const { id, createdBy, updatedBy, origin, hightlights } =
      allowedOrigin ?? {};
    this._id = id;
    this.createdAt = moment().milliseconds();
    this.createdBy = createdBy;
    this.updatedAt = moment().milliseconds();
    this.updatedBy = updatedBy;

    this.origin = origin;
    this.highlights = hightlights;
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
