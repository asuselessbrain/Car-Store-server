import express, { NextFunction, Request, Response } from 'express';
import { carModels } from './car.controller';
import { carValidationSchema } from './car.validator';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../userModels/user.constants';
import { upload } from '../../utils/imageUploderInCloudinary';

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

router.post(
  '/',
  upload.fields([{ name: 'images' }]),
  (req, res, next: NextFunction) => {
    req.body = JSON.parse(req?.body?.data);
    next();
  },
  carValidator,
  auth(USER_ROLE.admin),
  carModels.createCars,
);
router.get('/', carModels.getAllCars);
router.get('/new-arrivals', carModels.getNewArrivals);
router.get('/similar/:carId/:model', carModels.similarCars);
router.get('/:carId', carModels.getSingleCar);
router.put('/:carId', auth(USER_ROLE.admin), carModels.updateCar);
router.delete('/:carId', auth(USER_ROLE.admin), carModels.deleteCar);

export const routers = router;
