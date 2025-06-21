import { NextFunction, Response, Router } from 'express';
import { AuthControllers } from './auth.controller';
import { UserValidation } from '../userModels/userValidation';
import { AuthValidation } from './auth.validation';
import validateRequest from '../../middlewares/validateRequest';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../userModels/user.constants';
import { upload } from '../../utils/imageUploderInCloudinary';

const authRouter = Router();

authRouter.post(
  '/register',
  upload.single('profileImg'),
  (req, res, next: NextFunction) => {
    req.body = JSON.parse(req?.body?.data);
    next()
  },
  validateRequest(UserValidation.userValidationSchema),
  AuthControllers.register,
);

authRouter.post('/verify-otp', AuthControllers.verifyOTP),

  authRouter.post('/resend-otp', AuthControllers.resendOTP),

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
