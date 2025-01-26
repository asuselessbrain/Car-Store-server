import { Request, Response } from 'express';
import { createCarServices } from './car.services';
import { responser } from '../../utils/responser';
import { StatusCodes } from 'http-status-codes';
import { catchAsync } from '../../utils/catchAsync';

const createCars = catchAsync(async (req: Request, res: Response) => {
  const car = req.body;

  const result = await createCarServices.createCarInDB(car);
  responser(res, {
    statusCode: StatusCodes.CREATED,
    message: 'Car created successfully',
    data: result,
  });
});

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
    res.json({
      message: 'Car retrieved failed',
      success: false,
      error: err,
    });
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
    res.json({
      message: 'Car retrieved failed',
      success: false,
      error: err,
    });
  }
};

const updateCar = async (req: Request, res: Response) => {
  try {
    const id = req.params.carId;
    const updatedCar = req.body;

    const result = await createCarServices.updateCarInDB(id, updatedCar);
    res.status(200).json({
      message: 'Car updated successfully',
      success: true,
      data: result,
    });
  } catch (err) {
    res.json({
      message: 'Car update failed',
      success: false,
      error: err,
    });
  }
};

const deleteCar = async (req: Request, res: Response) => {
  try {
    const id = req.params.carId;
    await createCarServices.deleteCarFromDB(id);
    res.status(200).json({
      message: 'Car deleted successfully',
      success: true,
      data: {},
    });
  } catch (err) {
    res.json({
      message: 'Car deletion failed',
      success: false,
      error: err,
    });
  }
};

export const carModels = {
  createCars,
  getAllCars,
  getSingleCar,
  updateCar,
  deleteCar,
};
