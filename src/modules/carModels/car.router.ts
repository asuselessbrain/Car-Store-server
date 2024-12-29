import express from 'express';
import { carModels } from './car.controller';

const router = express.Router();

router.post('/create-cars', carModels.createCars);

export const routers = router;
