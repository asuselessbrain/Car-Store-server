import QueryBuilder from '../../builder/QueryBuilder';
import { Cars } from './car.interface';
import { CarModel } from './car.model';

const createCarInDB = async (car: Cars) => {
  const result = await CarModel.create(car);
  return result;
};

const getAllCarsFromDB = async (payload: Record<string, unknown>) => {
  const searchFields = ['brand', 'model'];

  const carQuery = new QueryBuilder(CarModel.find(), payload)
    .search(searchFields)
    .filter()
    .sort()
    .pagination();

  const result = await carQuery.modelQuery;

  return result;
};

const getSingleCarFromDB = async (carId: string) => {
  const result = await CarModel.findOne({ _id: carId });
  return result;
};

const updateCarInDB = async (id: string, data: Cars) => {
  const result = await CarModel.findOneAndUpdate({ _id: id }, data, {
    new: true,
  });
  return result;
};

const deleteCarFromDB = async (id: string) => {
  const result = await CarModel.findOneAndDelete({ _id: id });
  return result;
};

export const createCarServices = {
  createCarInDB,
  getAllCarsFromDB,
  getSingleCarFromDB,
  updateCarInDB,
  deleteCarFromDB,
};
