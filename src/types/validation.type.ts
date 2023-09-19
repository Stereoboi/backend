import { Schema } from 'joi';

type TodoSchema = Schema<{
  title: string;
  description: string;
  access: boolean;
  complete: boolean;
}>;

type UserSchema = Schema<{
  email: string;
  password: string;
}>;

export type { TodoSchema, UserSchema };
