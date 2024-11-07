import moment from "moment";
import mongoose, { Date, Schema } from "mongoose";
import IMongoEntity, { TBasicMongoEntity } from "../mongo.entity";

type HealthInfo = {
  allergies: [];
  medication: [];
  isDiabetic: Boolean;
  surgeryDetails: {
    title: String;
    description: String;
  };
};

interface TModelPatient extends TBasicMongoEntity, Document {
  patientId: { type: String };
  name: { type: String };
  email: { type: String };
  phone: { type: Number };
  birthDate: { type: Date };
  bloodGroup: { type: String };
  dataConsent: { type: Boolean };
  address: { type: String };
  healthInfo: { type: HealthInfo };
}

const mongoSchema = new Schema<TModelPatient>({
  patientId: { type: String },
  name: { type: String },
  email: { type: String },
  phone: { type: Number },
  birthDate: { type: Date },
  bloodGroup: { type: String },
  dataConsent: { type: Boolean },
  address: { type: String },
  healthInfo: { type: Object },
  createdAt: { type: Number },
  createdBy: { type: String },
  updatedAt: { type: Number },
  updatedBy: { type: String },
});

const mongoModel = mongoose.model<TModelPatient>("patients", mongoSchema);

export default class PatientEntity implements IMongoEntity {
  _id: string;
  createdAt: number;
  createdBy: string | undefined;
  updatedAt: number;
  updatedBy: string | undefined;
  [key: string]: any;
  patientId: string;
  name: string;
  email: string;
  phone: number;
  birthDate: Date;
  bloodGroup: string;
  dataConsent: boolean;
  address: string;
  healthInfo: object;

  constructor(patient: Partial<TBasicMongoEntity>) {
    const {
      id,
      createdBy,
      updatedBy,
      patientId,
      name,
      email,
      phone,
      birthDate,
      bloodGroup,
      dataConsent,
      address,
      healthInfo,
    } = patient ?? {};
    this._id = id;
    this.createdAt = moment().milliseconds();
    this.createdBy = createdBy;
    this.updatedAt = moment().milliseconds();
    this.updatedBy = updatedBy;

    this.patientId = patientId;
    this.name = name;
    this.email = email;
    this.phone = phone;
    this.birthDate = birthDate;
    this.bloodGroup = bloodGroup;
    this.dataConsent = dataConsent;
    this.address = address;
    this.healthInfo = healthInfo;
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
