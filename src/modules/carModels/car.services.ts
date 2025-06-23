import QueryBuilder from '../../builder/QueryBuilder';
import { sendImageToCloudinary } from '../../utils/imageUploderInCloudinary';
import { Cars } from './car.interface';
import { CarModel } from './car.model';

const createCarInDB = async (files: any, car: Cars) => {

  const imageUploderPromise = files.map((file: any)=> sendImageToCloudinary(file?.path, car?.name as string))

  const uploadImage = await Promise.all(imageUploderPromise)

  const secureUrls = uploadImage.map((upload: any)=> upload.secure_url)

  const carInfo = {
    ...car,
    images: secureUrls

  }
  const result = await CarModel.create(carInfo);
  return result;
};

const getAllCarsFromDB = async (payload: Record<string, unknown>) => {
  const searchFields = ['brand', 'model'];

  const carQuery = new QueryBuilder(CarModel.find(), payload)
    .search(searchFields)
    .filter()
    .sort()
    .pagination();

  const meta = await carQuery.countTotal();
  const result = await carQuery.modelQuery;

  return { meta, result };
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
