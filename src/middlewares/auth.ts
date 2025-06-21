import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { TUserRole } from '../modules/userModels/user.interface';
import { catchAsync } from '../utils/catchAsync';
import User from '../modules/userModels/user.model';
import config from '../config';
import { StatusCodes } from 'http-status-codes';
import AppError from '../errors/AppError';

const auth = (...requiredRoles: TUserRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;
    // checking if the token is missing
    if (!token) {
      throw new AppError(StatusCodes.UNAUTHORIZED, 'You are not authorized!');
    }

    let decoded;

    // checking if the given token is valid

    // const decoded = jwt.verify(
    //   token,
    //   config.jwt_secret as string,
    // ) as JwtPayload;
    try {
      decoded = jwt.verify(token, config.jwt_secret as string) as JwtPayload;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      throw new AppError(StatusCodes.UNAUTHORIZED, 'You are not authorized!');
    }

    const { role, email } = decoded;

    // checking if the user is exist
    const user = await User.findOne({ email });

    if (!user) {
      throw new AppError(StatusCodes.NOT_FOUND, 'This user is not found');
    }

    // checking if the user is blocked
    const userStatus = user?.userStatus;

    if (userStatus === 'blocked') {
      throw new AppError(StatusCodes.FORBIDDEN, 'This user is blocked ! !');
    }

    if (requiredRoles && !requiredRoles.includes(role)) {
      throw new AppError(StatusCodes.UNAUTHORIZED, 'You are not authorized');
    }

    req.user = user;
    next();
  });
};

export default auth;
