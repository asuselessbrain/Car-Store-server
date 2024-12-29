import { CarModel } from '../carModels/car.model';
import { Order } from './order.interface';
import { OrderModel } from './order.medel';

const updateCarInventoryInDB = async (carId: string, orderQuantity: number) => {
  try {
    const car = await CarModel.findById(carId);
    if (!car) {
      throw new Error('Car not found');
    }

    if (car.quantity < orderQuantity) {
      throw new Error('Insufficient stock');
    }

    car.quantity -= orderQuantity;
    car.inStock = car.quantity > 0;

    const updatedCar = await car.save();
    return updatedCar;
  } catch (err) {
    console.error('Error updating car inventory:', err);
    throw err; // Ensure the error is propagated
  }
};

const createOrderInDB = async (order: Order) => {
  try {
    const result = await OrderModel.create(order);
    return result;
  } catch (err) {
    console.error('Error creating order:', err);
    throw err;
  }
};

export const orderServices = {
  updateCarInventoryInDB,
  createOrderInDB,
};
