import moment from "moment";
import mongoose, { Model, Schema } from "mongoose";
import IMongoEntity, { TBasicMongoEntity } from "../mongo.entity";

export enum USER_ROLE {
  ADMIN = "ADMIN",
  STAFF = "STAFF",
  OWNER = "OWNER",
  RESIDENT = "RESIDENT",
  TENANT = "TENANT",
  GUEST = "GUEST",
}

interface TModelUser extends TBasicMongoEntity, Document {
  name: { type: String };
  username: { type: String };
  password: { type: String };
  otp: { type: Number };
  roles: { type: USER_ROLE[] };
}

const mongoSchema = new Schema<TModelUser>({
  name: { type: String },
  username: { type: String, required: true, unique: true },
  password: { type: String },
  otp: { type: Number },
  roles: {
    type: [{ type: String, enum: Object.values(USER_ROLE), required: true }],
    default: [USER_ROLE.GUEST],
  },
  createdAt: { type: Number },
  createdBy: { type: String },
  updatedAt: { type: Number },
  updatedBy: { type: String },
});

const mongoModel = mongoose.model<TModelUser>("users", mongoSchema);

export default class UserEntity implements IMongoEntity {
  _id: string;
  createdAt: number;
  createdBy: string | undefined;
  updatedAt: number;
  updatedBy: string | undefined;
  [key: string]: any;
  private name: string | undefined;
  private username: string | undefined;
  private password: string | undefined;
  private otp: number | undefined;
  private roles: USER_ROLE[];

  constructor(user: Partial<TBasicMongoEntity>) {
    const { id, createdBy, updatedBy, name, username, password, otp, roles } =
      user ?? {};
    this._id = id;
    this.createdAt = moment().milliseconds();
    this.createdBy = createdBy;
    this.updatedAt = moment().milliseconds();
    this.updatedBy = updatedBy;

    this.name = name;
    this.username = username;
    this.password = password;
    this.otp = otp;
    this.roles = roles;
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
