import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { responser } from '../../utils/responser';
import { catchAsync } from '../../utils/catchAsync';
import { AuthService } from './auth.service';
import { JwtPayload } from 'jsonwebtoken';
import config from '../../config';


const register = catchAsync(async (req: Request, res: Response) => {

  const result = await AuthService.register(req.file,req.body);

  responser(res, {
    statusCode: StatusCodes.CREATED,
    message: 'OTP sent to your email',
    data: {
      email: result
    },
  });
});

const verifyOTP = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.verifyOTP(req.body);

  if (req?.body?.context === "login" && result &&  "refreshToken" in result) {

    res.cookie('refreshToken', result?.refreshToken, {
      secure: config.node_env === 'production',
      httpOnly: true,
      sameSite: 'none',
    });
  }

  const message =
    req?.body?.context === 'signup'
      ? 'User registered and verified successfully!'
      : 'User logged in successfully!';

  responser(res, {
    statusCode: StatusCodes.OK,
    message,
    data: result
  })
})

const resendOTP = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.resendOTP(req.body);
  responser(res, {
    statusCode: StatusCodes.OK,
    message: "OTP has been resent successfully.",
    data: result
  })
})

const login = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.login(req.body);

  responser(res, {
    statusCode: StatusCodes.ACCEPTED,
    message: 'OTP sent to your email',
    data: result,
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
  verifyOTP,
  resendOTP
};
