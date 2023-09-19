/* eslint-disable import/no-cycle */
import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
} from "typeorm";

import { Todo } from "./Todo";

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: string;

  @Column()
  email!: string;

  @Column()
  password!: string;

  @Column({ nullable: true })
  verify?: string;

  @Column({ nullable: true })
  isOnline?: boolean;

  @OneToMany(
    () => {
      return Todo;
    },
    (todo) => {
      return todo.user;
    }
  )
  todos!: Todo[];
}
