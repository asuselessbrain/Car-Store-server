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

  let result = await OrderModel.create(OrderData);

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
  const payment = await orderUtils.paymentResult(spPayload);
  if (payment?.transactionStatus) {
    result = await result.updateOne({
      transaction: {
        id: payment.sp_order_id,
        transactionStatus: payment.transactionStatus,
      },
    });
  }

  return payment.checkout_url;
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

const verifyPayment = async (order_id: string) => {
  const verifiedPayment = await orderUtils.verifyPaymentAsync(order_id);

  if (verifiedPayment.length) {
    await OrderModel.findOneAndUpdate(
      {
        'transaction.id': order_id,
      },
      {
        'transaction.bank_status': verifiedPayment[0].bank_status,
        'transaction.sp_code': verifiedPayment[0].sp_code,
        'transaction.sp_message': verifiedPayment[0].sp_message,
        'transaction.transactionStatus': verifiedPayment[0].transaction_status,
        'transaction.method': verifiedPayment[0].method,
        'transaction.date_time': verifiedPayment[0].date_time,
        status:
          verifiedPayment[0].bank_status == 'Success'
            ? 'Paid'
            : verifiedPayment[0].bank_status == 'Failed'
              ? 'Pending'
              : verifiedPayment[0].bank_status == 'Cancel'
                ? 'Cancelled'
                : '',
      },
    );
  }
  return verifiedPayment;
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
  verifyPayment,
};
