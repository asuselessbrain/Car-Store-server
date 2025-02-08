// import { NextFunction, Router } from 'express';
import { Router } from 'express';
import { userController } from './user.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from './user.constants';
// import { userValidationSchema } from './userValidation';

const userRouter = Router();

userRouter.post(
  '/create-admin',
  auth(USER_ROLE.admin),
  userController.createAdmin,
);
userRouter.get(
  '/get-single-user',
  auth(USER_ROLE.user, USER_ROLE.admin),
  userController.getSingleUser,
);
userRouter.put('/:userId', auth(USER_ROLE.user), userController.updateUser);
userRouter.put(
  '/change-password/:id',
  auth(USER_ROLE.user),
  userController.changePassword,
);
userRouter.delete('/:userId', auth(USER_ROLE.admin), userController.deleteUser);
userRouter.put(
  '/block-user/:userId',
  auth(USER_ROLE.admin),
  userController.blockUser,
);
userRouter.get('/', auth(USER_ROLE.admin), userController.getUser);

export default userRouter;
