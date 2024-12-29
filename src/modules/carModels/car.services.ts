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

export const createCarServices = {
  createCarInDB,
};
