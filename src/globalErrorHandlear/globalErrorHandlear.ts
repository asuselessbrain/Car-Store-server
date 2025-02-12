import { NextFunction, Request, Response } from 'express';

class CustomError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.name = this.constructor.name; // Set the error name to the class name
  }
}

export const globalErrorHandlear = (
  err: CustomError,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction,
) => {
  res.status(err.statusCode || 500).json({
    message: 'An error occurred',
    errorMessage: err.message,
    error: err,
  });
};
