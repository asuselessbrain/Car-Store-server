import express from 'express';
import { carModels } from './car.controller';

const router = express.Router();

router.post('/create-cars', carModels.createCars);
router.get('/', carModels.getAllCars);
router.get('/:carId', carModels.getSingleCar);
router.put('/update-car/:carId', carModels.updateCar);

export const routers = router;
