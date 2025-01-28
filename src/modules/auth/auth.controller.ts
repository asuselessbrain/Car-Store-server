import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { responser } from '../../utils/responser';
import { catchAsync } from '../../utils/catchAsync';
import { AuthService } from './auth.service';
import { JwtPayload } from 'jsonwebtoken';

const register = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.register(req.body);

  responser(res, {
    statusCode: StatusCodes.CREATED,
    message: 'User registered successfully',
    data: result,
  });
});
const login = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.login(req.body);

  responser(res, {
    statusCode: StatusCodes.ACCEPTED,
    message: 'User logged in successfully',
    token: result?.token,
    data: result?.user,
  });
});

const changePassword = catchAsync(async (req: Request, res: Response) => {
  const { ...passwordData } = req.body;
  console.log(req.user);

  await AuthService.changePassword(req.user as JwtPayload, passwordData);

  responser(res, {
    statusCode: StatusCodes.ACCEPTED,
    message: 'Password changed successfully',
    data: null,
  });
});

export const AuthControllers = {
  register,
  login,
  changePassword,
};
