import { Cars } from './car.interface';
import { CarModel } from './car.model';

const createCarInDB = async (car: Cars) => {
  const result = await CarModel.create(car);
  return result;
};

const getAllCarsFromDB = async (filters: {
  category?: string;
  brand?: string;
  model?: string;
}) => {
  const query: Record<string, string> = {};

  if (filters.category) {
    query.category = filters.category;
  }
  if (filters.brand) {
    query.brand = filters.brand;
  }
  if (filters.model) {
    query.model = filters.model;
  }

  const result = await CarModel.find(query);
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
