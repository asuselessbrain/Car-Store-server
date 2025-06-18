import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { responser } from '../../utils/responser';
import { catchAsync } from '../../utils/catchAsync';
import { AuthService } from './auth.service';
import { JwtPayload } from 'jsonwebtoken';
import config from '../../config';


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

  const { refreshToken } = result;

  res.cookie('refreshToken', refreshToken, {
    secure: config.node_env === 'production',
    httpOnly: true,
  });

  responser(res, {
    statusCode: StatusCodes.ACCEPTED,
    message: 'User logged in successfully',
    token: result?.token,
    data: result?.user,
  });
});

const changePassword = catchAsync(async (req: Request, res: Response) => {
  const { ...passwordData } = req.body;

  await AuthService.changePassword(req.user as JwtPayload, passwordData);

  responser(res, {
    statusCode: StatusCodes.ACCEPTED,
    message: 'Password changed successfully',
    data: null,
  });
});

const generateTokenUsingRefreshToken = catchAsync(
  async (req: Request, res: Response) => {
    const { refreshToken } = req.cookies;
    const result =
      await AuthService.generateTokenUsingRefreshToken(refreshToken);

    responser(res, {
      statusCode: StatusCodes.ACCEPTED,
      message: 'New token generated successfully',
      data: result,
    });
  },
);

export const AuthControllers = {
  register,
  login,
  changePassword,
  generateTokenUsingRefreshToken,
};
