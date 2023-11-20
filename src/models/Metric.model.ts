import { Column, Table } from 'sequelize-typescript';
import { BaseModel } from './Base.model';

@Table({ tableName: 'metrics', modelName: 'metric' })
export class Metric extends BaseModel<Metric> {
  @Column
  activeUser: number | null;
}
