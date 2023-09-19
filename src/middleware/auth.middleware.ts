import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../helpers/custom.errors';

import { myPassport } from './passport.middleware';

export function authenticate(strategy: string, options: { session: boolean }) {
  return function (req: Request, res: Response, next: NextFunction) {
    myPassport.authenticate(
      strategy,
      options,
      (error: Error, user: { id: string; email: string; password: string }) => {
        if (error) {
          return next(error);
        }
        if (!user) {
          throw new CustomError('unauthorized please sign up', 401);
        }
        return req.logIn(user, options, (err) => {
          if (err) {
            return next(err);
          }
          const body = { id: user.id, email: user.email };
          req.user = body;

          return next();
        });
      }
    )(req, res, next);
  };
}
