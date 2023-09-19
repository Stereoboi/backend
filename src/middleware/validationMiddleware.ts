import { Request, Response, NextFunction } from 'express';
import { TodoSchema, UserSchema } from '../types/validation.type';

export const bodyValidation = (schema: TodoSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const validationResult = schema.validate(req.body);

    if (validationResult.error) {
      const errorMessage = validationResult.error.details[0].message;
      return res.status(400).json({ message: errorMessage });
    }

    next();
  };
};

export const userValidation = (schema: UserSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const validationResult = schema.validate(req.body);

    if (validationResult.error) {
      const errorMessage = validationResult.error.details[0].message;
      return res.status(400).json({ message: errorMessage });
    }

    next();
  };
};
