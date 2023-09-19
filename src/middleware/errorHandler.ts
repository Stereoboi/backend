import { Request, Response, NextFunction } from 'express';

const ErrorHandler = (error: any, req: Request, res: Response, next: NextFunction) => {
  const errStatus = error.statusCode || 500;

  const errMsg = error.message || 'Something went wrong';
  res.status(errStatus).json({
    success: false,
    status: errStatus,
    message: errMsg
  });
  next();
};

export default ErrorHandler;
