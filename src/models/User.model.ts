import { NonAttribute } from 'sequelize';
import { AfterFind, AfterUpdate, Column, HasOne, Table } from 'sequelize-typescript';
import { BaseModel } from './Base.model';
import { UserLimit } from './UserLimit.model';

@Table({ tableName: 'users', modelName: 'user' })
export class User extends BaseModel<User> {
  @Column
  userName: string | null;

  @Column
  firstName: string | null;

  @Column
  activeChatId: string | null;

  @Column
  chatId: number;

  @Column
  lastActiveAt: Date | null;

  @Column
  isAdmin: boolean;

  @Column
  isActive: boolean;

  @HasOne(() => UserLimit, {
    foreignKey: 'userId',
  })
  userLimit?: NonAttribute<UserLimit>;

  @AfterFind
  private static updateLastActive(model: User) {
    model.update({ lastActiveAt: new Date() });
  }
}
