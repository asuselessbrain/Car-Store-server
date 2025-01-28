import { CarModel } from '../carModels/car.model';
import { IOrder } from './order.interface';
import { OrderModel } from './order.medel';

const updateCarInventoryInDB = async (carId: string, orderQuantity: number) => {
  const car = await CarModel.findById(carId);
  if (!car) {
    throw new Error('Car not found');
  }

  if (car.quantity < orderQuantity) {
    throw new Error('Insufficient stock');
  }

  // Update car inventory
  car.quantity -= orderQuantity;
  car.inStock = car.quantity > 0;

  const updatedCar = await car.save();
  return updatedCar;
};

const createOrderInDB = async (order: IOrder) => {
  const result = await OrderModel.create(order);
  return result;
};

const getAllOrdersFromDB = async () => {
  const result = await OrderModel.find().populate('userId').populate('car');
  return result;
};

const calculateTotalRevenue = async () => {
  const result = await OrderModel.aggregate([
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: '$totalPrice' },
      },
    },
  ]);
  return result[0].totalRevenue;
};

const getOrderByEmailFromDB = async (email: string) => {
  const result = await OrderModel.find({ email });
  return result;
};

export const orderServices = {
  updateCarInventoryInDB,
  createOrderInDB,
  calculateTotalRevenue,
  getAllOrdersFromDB,
  getOrderByEmailFromDB,
};
