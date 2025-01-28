// import { NextFunction, Router } from 'express';
import { Router } from 'express';
import { userController } from './user.controller';
// import { userValidationSchema } from './userValidation';

const userRouter = Router();

// const userValidator = async (
//   req: Request,
//   res: Response,
//   next: NextFunction,
// ) => {
//   try {
//     await userValidationSchema.parseAsync(req.body);
//     next();
//   } catch (err) {
//     next(err);
//   }
// };

userRouter.post('/create-admin', userController.createUser);
userRouter.get('/:userId', userController.getSingleUser);
userRouter.put('/:userId', userController.updateUser);
userRouter.delete('/:userId', userController.deleteUser);

export default userRouter;
