import express from 'express';
import { carModels } from './car.controller';

const router = express.Router();

router.post('/create-cars', carModels.createCars);
router.get('/', carModels.getAllCars);

export const routers = router;
