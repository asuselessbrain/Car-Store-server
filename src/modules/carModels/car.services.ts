import QueryBuilder from '../../builder/QueryBuilder';
import { sendImageToCloudinary } from '../../utils/imageUploderInCloudinary';
import { Cars } from './car.interface';
import { CarModel } from './car.model';

const createCarInDB = async (car: Cars) => {
  const result = await CarModel.create(car);
  return result;
};

const getAllCarsFromDB = async (payload: Record<string, unknown>) => {
  const searchFields = ['name'];

  const carQuery = new QueryBuilder(CarModel.find(), payload)
    .search(searchFields)
    .filter()
    .sort()
    .pagination();

  const meta = await carQuery.countTotal();
  const result = await carQuery.modelQuery;

  return { meta, result };
};

const getNewArrivalsFromDB = async () => {
  const result = await CarModel.find({ inStock: true })
    .sort({ createdAt: -1 })
    .limit(8);
  return result;
}

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

const similarCarsInDB = async (carId: string, model: string) => {
  const result = await CarModel.find({
    _id: { $ne: carId },
    model: model,
    inStock: true,
  }).limit(10);
  return result;
}

export const createCarServices = {
  createCarInDB,
  getAllCarsFromDB,
  getSingleCarFromDB,
  updateCarInDB,
  deleteCarFromDB,
  getNewArrivalsFromDB,
  similarCarsInDB,
};
