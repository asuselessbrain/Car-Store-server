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

const calculateTotalRevenue = async () => {
  try {
    const result = await OrderModel.aggregate([
      {
        $lookup: {
          from: 'cars', // The name of the cars collection in MongoDB
          localField: 'car', // Field in orders
          foreignField: '_id', // Field in cars
          as: 'carDetails',
        },
      },
      {
        $unwind: '$carDetails', // Flatten the carDetails array
      },
      {
        $project: {
          _id: 0,
          revenue: {
            $multiply: ['$quantity', '$carDetails.price'], // Calculate revenue for each order
          },
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$revenue' }, // Sum up all revenue values
        },
      },
    ]);

    return result.length > 0 ? result[0].totalRevenue : 0; // Return totalRevenue or 0 if no orders
  } catch (err) {
    console.error('Error calculating revenue:', err);
    throw new Error('Error calculating revenue');
  }
};

export const orderServices = {
  updateCarInventoryInDB,
  createOrderInDB,
  calculateTotalRevenue,
};
