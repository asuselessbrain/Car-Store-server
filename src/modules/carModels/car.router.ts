import express, { NextFunction, Request, Response } from 'express';
import { carModels } from './car.controller';
import { carValidationSchema } from './car.validator';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../userModels/user.constants';

const router = express.Router();

const carValidator = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    await carValidationSchema.parseAsync(req.body);
    next();
  } catch (err) {
    next(err);
  }
};

router.post('/', carValidator, auth(USER_ROLE.admin), carModels.createCars);
router.get('/', carModels.getAllCars);
router.get('/:carId', carModels.getSingleCar);
router.put('/:carId', auth(USER_ROLE.admin), carModels.updateCar);
router.delete('/:carId', auth(USER_ROLE.admin), carModels.deleteCar);

export const routers = router;
