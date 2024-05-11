import { NonAttribute } from 'sequelize';
import { Column, HasMany, Table } from 'sequelize-typescript';
import { BaseModel } from './Base.model';
import { UserLimit } from './UserLimit.model';

@Table({ tableName: 'limits', modelName: 'limit' })
export class Limit extends BaseModel<Limit> {
  @Column
  requestAmount: number;

  @HasMany(() => UserLimit, {
    foreignKey: 'limitId',
  })
  UserLimit?: NonAttribute<UserLimit[]>;
}
