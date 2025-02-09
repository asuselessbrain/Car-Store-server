import { CarModel } from '../carModels/car.model';
import { IUser } from '../userModels/user.interface';
import { IOrder } from './order.interface';
import { OrderModel } from './order.medel';
import { orderUtils } from './order.utils';

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

const createOrderInDB = async (
  user: IUser,
  order: IOrder,
  client_ip: string,
) => {
  if (!order.car) {
    throw new Error('Car is required');
  }
  const car = await CarModel.findById(order.car);

  const OrderData = {
    userId: user._id,
    totalPrice: order.quantity * Number(car?.price),
    car: order.car,
    quantity: order.quantity,
  };

  const result = await OrderModel.create(OrderData);

  const spPayload = {
    amount: OrderData.totalPrice,
    order_id: result._id.toString(),
    currency: 'BDT',
    customer_name: user?.name,
    customer_address: 'Dumki, Patuakhali',
    customer_email: user?.email,
    customer_phone: '017XXXXXXXX',
    customer_city: 'Patukhali',
    client_ip,
  };
  const paymentInfo = await orderUtils.paymentResult(spPayload);
  return { result, paymentInfo };
};

const getAllOrdersFromDB = async () => {
  const result = await OrderModel.find().populate('userId').populate('car');
  return result;
};

const calculateTotalRevenue = async () => {
  const result = await OrderModel.aggregate([
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
        },
        totalRevenue: { $sum: '$totalPrice' },
      },
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } },
  ]);
  return result.map(({ _id, totalRevenue }) => ({
    year: _id.year,
    month: _id.month,
    totalRevenue,
  }));
};

const totalRevenue = async () => {
  const result = await OrderModel.aggregate([
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: '$totalPrice' },
      },
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } },
  ]);
  return result[0];
};

const sellByBrand = async () => {
  const result = await OrderModel.aggregate([
    {
      $lookup: {
        from: 'cars',
        localField: 'car',
        foreignField: '_id',
        as: 'brandDetails',
      },
    },
    {
      $unwind: '$brandDetails', // Unwind the result of the lookup to access brand details
    },
    {
      $group: {
        _id: '$brandDetails.brand', // Group by the brand name (adjust to match field in 'brands' collection)
        orderCount: { $sum: '$quantity' },
      },
    },
    {
      $sort: { orderCount: -1 },
    },
  ]);

  return result.map(({ _id, orderCount }) => ({ brand: _id, orderCount }));
};

const updateStatus = async (id: string) => {
  const data = { status: 'delivered' };
  const result = await OrderModel.findByIdAndUpdate(id, data, {
    new: true,
  });
  return result;
};

const updateStatusByUser = async (id: string) => {
  const data = { status: 'cancelled' };
  const result = await OrderModel.findByIdAndUpdate(id, data, {
    new: true,
  });
  return result;
};

const getOrderByIdFromDB = async (userId: string) => {
  const result = await OrderModel.find({ userId }).populate('car');
  return result;
};

export const orderServices = {
  updateCarInventoryInDB,
  createOrderInDB,
  calculateTotalRevenue,
  getAllOrdersFromDB,
  getOrderByIdFromDB,
  updateStatus,
  updateStatusByUser,
  sellByBrand,
  totalRevenue,
};
