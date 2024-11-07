import moment from "moment";
import { Model, Schema } from "mongoose";
import IEntity, { TEntity } from "../entity";

export interface TBasicMongoEntity extends TEntity {
  // _id: string | number;
  createdAt: number;
  updatedAt: number;
  [key: string]: any;
}

export const DEFAULT_BASIC_MONGO_ENTITY: TBasicMongoEntity = {
  // _id: undefined,
  createdAt: moment().valueOf(),
  createdBy: "",
  updatedAt: moment().valueOf(),
  updatedBy: "",
};

export default interface IMongoEntity extends IEntity {
  createdAt: number;
  createdBy: string | undefined;
  updatedAt: number;
  updatedBy: string | undefined;
  [key: string]: any;

  getSchema(): Schema;
  getModel(): any;
}
