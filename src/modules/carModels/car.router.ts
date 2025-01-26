import express, { NextFunction, Request, Response } from 'express';
import { carModels } from './car.controller';
import { carValidationSchema } from './car.validator';

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

router.post('/', carValidator, carModels.createCars);
router.get('/', carModels.getAllCars);
router.get('/:carId', carModels.getSingleCar);
router.put('/:carId', carModels.updateCar);
router.delete('/:carId', carModels.deleteCar);

export const routers = router;
