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
  } catch (err) {
    console.error(err);
    throw new Error('Error getting all cars from DB');
  }
};

const getSingleCarFromDB = async (carId: string) => {
  try {
    const result = await CarModel.findOne({ _id: carId });
    return result;
  } catch (err) {
    console.error(err);
    throw new Error('Error getting single car from DB');
  }
};

const updateCarInDB = async (id: string, data: Cars) => {
  try {
    const result = await CarModel.findOneAndUpdate({ _id: id }, data, {
      new: true,
    });
    return result;
  } catch (err) {
    console.error(err);
    throw new Error('Error updating car in DB');
  }
};

const deleteCarFromDB = async (id: string) => {
  try {
    const result = await CarModel.findOneAndDelete({ _id: id });
    return result;
  } catch (err) {
    console.error(err);
    throw new Error('Error updating car in DB');
  }
};

export const createCarServices = {
  createCarInDB,
  getAllCarsFromDB,
  getSingleCarFromDB,
  updateCarInDB,
  deleteCarFromDB,
};
