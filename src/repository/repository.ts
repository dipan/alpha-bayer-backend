import IEntity, { TEntity } from "../entity/entity";

export default interface IRepository<T extends TEntity> {
  create(entity: T): Promise<T>;
  read(): Promise<T[]>;
  readById(id: string | number): Promise<T>;
  updateById(id: string | number, entity: T): Promise<T>;
  deleteById(id: string | number): Promise<T>;
}
