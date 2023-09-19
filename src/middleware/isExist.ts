import { Response, Request, NextFunction } from 'express';
import { getConnection, ObjectType } from 'typeorm';

export const isExist = <T>(dbEntity: ObjectType<T>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const newConnection = getConnection();
    const repository = newConnection.getRepository(dbEntity);

    const todo = await repository.findOne({ where: { id } });

    if (todo) {
      next();
    } else {
      res.status(404).json({ message: `Todo with id ${id} not found` });
    }
  };
};
