import { Request, Response } from 'express';
import { createCarServices } from './car.services';

const createCars = async (req: Request, res: Response) => {
  try {
    const car = req.body.cars;

    const result = await createCarServices.createCarInDB(car);
    res.status(200).json({
      message: 'Car created successfully',
      success: true,
      data: result,
    });
  } catch (err) {
    console.log(err);
  }
};

export const carModels = {
  createCars,
};
