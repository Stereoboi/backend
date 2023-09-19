import { Request } from "express";

export interface IUserAuthStatusRequest extends Request {
  user: {
    id: string;
    email: string;
  };
}

export interface UserType {
  id?: string;
  email?: string;
  password?: string;
}

export interface MyUser {
  id: string;
  email: string;
}
