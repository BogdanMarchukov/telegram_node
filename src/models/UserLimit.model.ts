import { NonAttribute } from 'sequelize';
import { BelongsTo, Column, DataType, NotNull, Table, Unique } from 'sequelize-typescript';
import { BaseModel } from './Base.model';
import { Limit } from './Limit.model';
import { User } from './User.model';

@Table({ tableName: 'user_limits', modelName: 'userLimit' })
export class UserLimit extends BaseModel<UserLimit> {
  @Column
  requestAmount: number;

  @Column
  @Unique
  @NotNull
  @Column(DataType.UUID)
  userId: string;

  @Column
  @NotNull
  @Column(DataType.UUID)
  limitId: string;

  @BelongsTo(() => Limit, 'limitId')
  limit?: NonAttribute<Limit>;

  @BelongsTo(() => User, 'userId')
  user?: NonAttribute<User>;

  async decrementRequestAmount() {
    if (this.requestAmount > 0) {
      await this.update({ requestAmount: this.requestAmount - 1 });
    }
  }

  async resetRequestAmount() {
    const limit = await Limit.findByPk(this.limitId);
    if (limit) {
      await this.update({ requestAmount: limit.requestAmount });
    }
  }
}
