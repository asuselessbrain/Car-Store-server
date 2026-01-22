import { NextFunction, Router } from 'express';
import { AuthControllers } from './auth.controller';
import { UserValidation } from '../userModels/userValidation';
import { AuthValidation } from './auth.validation';
import validateRequest from '../../middlewares/validateRequest';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../userModels/user.constants';

const authRouter = Router();

authRouter.post(
  '/register',
  validateRequest(UserValidation.userValidationSchema),
  AuthControllers.register,
);

authRouter.post(
  '/login',
  validateRequest(AuthValidation.loginValidationSchema),
  AuthControllers.login,
);

authRouter.post(
  '/change-password',
  auth(USER_ROLE.admin, USER_ROLE.user),
  validateRequest(AuthValidation.passwordChangeValidationSchema),
  AuthControllers.changePassword,
);

authRouter.post(
  '/generate-new-token',
  validateRequest(AuthValidation.tokenValidation),
  AuthControllers.generateTokenUsingRefreshToken,
);

export default authRouter;
