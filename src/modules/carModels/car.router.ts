import express from 'express';
import { carModels } from './car.controller';

const router = express.Router();

router.post('/', carModels.createCars);
router.get('/', carModels.getAllCars);
router.get('/:carId', carModels.getSingleCar);
router.put('/:carId', carModels.updateCar);
router.delete('/:carId', carModels.deleteCar);

export const routers = router;
