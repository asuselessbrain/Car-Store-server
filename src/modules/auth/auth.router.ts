import { Router } from 'express';
import { AuthControllers } from './auth.controller';
import { UserValidation } from '../userModels/userValidation';
import { AuthValidation } from './auth.validation';
import validateRequest from '../../middlewares/validateRequest';

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

export default authRouter;
