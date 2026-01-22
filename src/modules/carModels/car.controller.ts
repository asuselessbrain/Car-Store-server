import { Request, Response } from 'express';
import { createCarServices } from './car.services';
import { responser } from '../../utils/responser';
import { StatusCodes } from 'http-status-codes';
import { catchAsync } from '../../utils/catchAsync';

const createCars = catchAsync(async (req: Request, res: Response) => {
  console.log("arfan")
  const car = req.body;

  console.log(car)

  const result = await createCarServices.createCarInDB(car);
  responser(res, {
    statusCode: StatusCodes.CREATED,
    message: 'Car created successfully',
    data: result,
  });
});

const getAllCars = catchAsync(async (req: Request, res: Response) => {
  const query = req.query;

  const result = await createCarServices.getAllCarsFromDB(query);
  res.status(200).json({
    message: 'Cars retrieved successfully',
    success: true,
    data: result,
  });
});

const getNewArrivals = catchAsync(async (req: Request, res: Response) => {
  const result = await createCarServices.getNewArrivalsFromDB();
  res.status(200).json({
    message: 'New arrivals retrieved successfully',
    success: true,
    data: result,
  });
});

const getSingleCar = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.carId;
  const result = await createCarServices.getSingleCarFromDB(id as string);
  res.status(200).json({
    message: 'Car retrieved successfully',
    success: true,
    data: result,
  });
});

const updateCar = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.carId;
  const updatedCar = req.body;

  const result = await createCarServices.updateCarInDB(id as string, updatedCar);
  res.status(200).json({
    message: 'Car updated successfully',
    success: true,
    data: result,
  });
});

const deleteCar = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.carId;
  await createCarServices.deleteCarFromDB(id as string);
  res.status(200).json({
    message: 'Car deleted successfully',
    success: true,
    data: {},
  });
});

const similarCars = catchAsync(async (req: Request, res: Response) => {
  const carId = req.params.carId;
  const model = req.params.model as string;

  const result = await createCarServices.similarCarsInDB(carId as string, model);
  res.status(200).json({
    message: 'Similar cars retrieved successfully',
    success: true,
    data: result,
  });
});

export const carModels = {
  createCars,
  getAllCars,
  getSingleCar,
  updateCar,
  deleteCar,
  getNewArrivals,
  similarCars,
};
