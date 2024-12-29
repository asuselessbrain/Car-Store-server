import { Cars } from './car.interface';
import { CarModel } from './car.model';

const createCarInDB = async (car: Cars) => {
  try {
    const result = await CarModel.create(car);
    return result;
  } catch (err) {
    console.error(err);
    throw new Error('Error creating car in DB');
  }
};

const getAllCarsFromDB = async (filters: {
  category?: string;
  brand?: string;
  model?: string;
}) => {
  try {
    const query: any = {};

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
  } catch (err) {
    console.error(err);
    throw new Error('Error getting all cars from DB');
  }
};

export const createCarServices = {
  createCarInDB,
  getAllCarsFromDB,
};
