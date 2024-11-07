import moment from "moment";
import mongoose, { Date, Schema } from "mongoose";
import IMongoEntity, { TBasicMongoEntity } from "../mongo.entity";

export enum APPOINTMENT_STATUS {
  CLOSED = "CLOSED",
  BOOKED = "BOOKED",
}

interface TModelAppointment extends TBasicMongoEntity, Document {
  patientId: { type: String };
  providerId: { type: String };
  appointmentDate: { type: Date };
  timeSlot: { type: Date };
  reasonForVisit: { type: String };
  additionalNote: { type: String };
  status: { type: APPOINTMENT_STATUS };
}

const mongoSchema = new Schema<TModelAppointment>({
  patientId: { type: String },
  providerId: { type: String },
  appointmentDate: { type: Date },
  timeSlot: { type: Date },
  reasonForVisit: { type: String },
  additionalNote: { type: String },
  status: {
    type: { type: String, enum: Object.values(APPOINTMENT_STATUS) },
  },
  createdAt: { type: Number },
  createdBy: { type: String },
  updatedAt: { type: Number },
  updatedBy: { type: String },
});

const mongoModel = mongoose.model<TModelAppointment>("users", mongoSchema);

export default class AppointmentEntity implements IMongoEntity {
  _id: string;
  createdAt: number;
  createdBy: string | undefined;
  updatedAt: number;
  updatedBy: string | undefined;
  [key: string]: any;
  private patientId: string | undefined;
  private providerId: string | undefined;
  private reasonForVisit: string | undefined;
  private additionalNote: string | undefined;
  private appointmentDate: Date;
  private timeSlot: Date;
  private status: APPOINTMENT_STATUS[];

  constructor(appointment: Partial<TBasicMongoEntity>) {
    const {
      id,
      createdBy,
      updatedBy,
      patientId,
      providerId,
      reasonForVisit,
      additionalNote,
      appointmentDate,
      timeSlot,
      status,
    } = appointment ?? {};
    this._id = id;
    this.createdAt = moment().milliseconds();
    this.createdBy = createdBy;
    this.updatedAt = moment().milliseconds();
    this.updatedBy = updatedBy;

    this.patientId = patientId;
    this.providerId = providerId;
    this.reasonForVisit = reasonForVisit;
    this.additionalNote = additionalNote;
    this.appointmentDate = appointmentDate;
    this.timeSlot = timeSlot;
    this.status = status;
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
