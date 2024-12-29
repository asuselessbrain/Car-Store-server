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

const getAllCars = async (req: Request, res: Response) => {
  try {
    const category = req.query.category as string | undefined;
    const brand = req.query.brand as string | undefined;
    const model = req.query.model as string | undefined;

    const result = await createCarServices.getAllCarsFromDB({
      category,
      brand,
      model,
    });
    res.status(200).json({
      message: 'Cars retrieved successfully',
      success: true,
      data: result,
    });
  } catch (err) {
    console.log(err);
  }
};

const getSingleCar = async (req: Request, res: Response) => {
  try {
    const id = req.params.carId;
    const result = await createCarServices.getSingleCarFromDB(id);
    res.status(200).json({
      message: 'Car retrieved successfully',
      success: true,
      data: result,
    });
  } catch (err) {
    console.log(err);
  }
};

const updateCar = async (req: Request, res: Response) => {
  try {
    const id = req.params.carId;
    const updatedCar = req.body.cars;

    const result = await createCarServices.updateCarInDB(id, updatedCar);
    res.status(200).json({
      message: 'Car updated successfully',
      success: true,
      data: result,
    });
  } catch (err) {
    console.log(err);
  }
};

export const carModels = {
  createCars,
  getAllCars,
  getSingleCar,
  updateCar,
};
