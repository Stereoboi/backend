/* eslint-disable import/no-cycle */
import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
} from "typeorm";

import { User } from "./User";

@Entity()
export class Todo extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: string;

  @Column()
  title!: string;

  @Column()
  description!: string;

  @Column()
  complete!: boolean;

  @Column()
  access!: boolean;

  @Column()
  owner!: string;

  @ManyToOne(
    () => {
      return User;
    },
    (user) => {
      return user.todos;
    }
  )
  user!: User;
}
