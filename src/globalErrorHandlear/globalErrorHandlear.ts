import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

export const globalErrorHandlear = (
  err: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction,
) => {
  res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    message: 'An error occurred',
    errorMessage: err.message,
    error: err,
  });
};
