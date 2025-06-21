// req and res manage

import { StatusCodes } from 'http-status-codes';
import { userService } from './user.services';
import { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { responser } from '../../utils/responser';

const createAdmin = catchAsync(async (req: Request, res: Response) => {

  const payload = req.body;

  const result = await userService.createAdmin(req?.file,payload);

  responser(res, {
    statusCode: StatusCodes.CREATED,
    message: 'User created successfully',
    data: result,
  });
});

const getUser = catchAsync(async (req: Request, res: Response) => {
  const result = await userService.getUser();

  responser(res, {
    statusCode: StatusCodes.OK,
    message: 'Users getting successfully',
    data: result,
  });
});

const getSingleUser = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?._id;

  const result = await userService.getSingleUser(userId);

  responser(res, {
    statusCode: StatusCodes.OK,
    message: 'User getting successfully',
    data: result,
  });
});

const updateUser = catchAsync(async (req: Request, res: Response) => {
  const userId = req.params.userId;
  const body = req.body;
  body.role = 'user';
  body.email = req?.user?.email;
  body.userStatus = req?.user?.userStatus;

  const result = await userService.updateUser(userId, body);

  responser(res, {
    statusCode: StatusCodes.OK,
    message: 'User name updated successfully',
    data: result,
  });
});

const deleteUser = catchAsync(async (req: Request, res: Response) => {
  const userId = req.params.userId;
  await userService.deleteUser(userId);

  responser(res, {
    statusCode: StatusCodes.OK,
    message: 'user deleted successfully',
    data: {},
  });
});

const blockUser = catchAsync(async (req: Request, res: Response) => {
  const userId = req.params.userId;
  const body = req.body;
  // await userService.deleteUser(userId);
  const result = await userService.blockUser(userId, body);

  responser(res, {
    statusCode: StatusCodes.OK,
    message: 'User Blocked',
    data: result,
  });
});

const changePassword = catchAsync(async (req: Request, res: Response) => {
  const userId = req.params.id;
  const { oldPassword, newPassword } = req.body;

  const result = await userService.changePassword(userId, {
    oldPassword,
    newPassword,
  });

  responser(res, {
    statusCode: StatusCodes.OK,
    message: 'Password updated successfully',
    data: result,
  });
});

export const userController = {
  createAdmin,
  getUser,
  getSingleUser,
  updateUser,
  deleteUser,
  blockUser,
  changePassword,
};
