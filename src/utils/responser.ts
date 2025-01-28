import { Response } from 'express';

type IData<T> = {
  statusCode: number;
  message: string;
  success?: boolean;
  token?: string;
  data: T | T[] | null;
};

export const responser = <T>(res: Response, data: IData<T>) => {
  res.status(data.statusCode).json({
    success: true,
    statusCode: data.statusCode,
    message: 'Car created successfully',
    token: data.token,
    data: data.data,
  });
};
