import { Column, Table } from 'sequelize-typescript';
import { BaseModel } from './Base.model';

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
}
