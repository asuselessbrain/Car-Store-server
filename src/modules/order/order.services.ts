import config from '../../config';
import sendOrderConfirmationMail from '../../utils/nodemainle';
import { CarModel } from '../carModels/car.model';
import { IUser } from '../userModels/user.interface';
import { IOrder } from './order.interface';
import { OrderModel } from './order.medel';
import { orderUtils } from './order.utils';

interface Car {
  _id: string;
  brand: string;
  model: string;
  category: string;
  price: number;
}

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
  order: IOrder & { platform?: 'web' | 'mobile' }, // platform optional but accepted
  client_ip: string,
) => {
  if (!order.car) {
    throw new Error('Car is required');
  }

  const car = await CarModel.findById(order.car);
  if (!car) {
    throw new Error('Car not found');
  }

  const OrderData = {
    userId: user._id,
    totalPrice: order.quantity * Number(car.price),
    car: order.car,
    quantity: order.quantity,
  };

  let result = await OrderModel.create(OrderData);

  // Determine return_url based on platform
  const return_url =
    order.platform === 'mobile'
      ? config.sp.sp_return_url_mobile
      : config.sp.sp_return_url_web;

  const spPayload = {
    amount: OrderData.totalPrice,
    order_id: result._id,
    currency: 'BDT',
    customer_name: user?.firstName + user?.lastName,
    customer_address: 'Dumki, Patuakhali',
    customer_email: user?.email,
    customer_phone: '017XXXXXXXX',
    customer_city: 'Patukhali',
    client_ip,
    return_url, // Added return_url to payload
  };

  const payment = await orderUtils.paymentResult(spPayload, order.platform as 'web' | 'mobile');

  if (payment?.transactionStatus) {
    await result.updateOne({
      transaction: {
        id: payment.sp_order_id,
        transactionStatus: payment.transactionStatus,
      },
    });
  }

  return payment.checkout_url;
};

const getAllOrdersFromDB = async () => {
  const result = await OrderModel.find()
    .populate('userId')
    .populate('car')
    .sort({ _id: -1 });
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
  const order = await OrderModel.findById(id);
  if (order?.paymentStatus === 'cancelled') {
    throw new Error(
      'The order cannot be delivered because the payment was cancelled.',
    );
  }
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
  const result = await OrderModel.find({ userId })
    .populate('car')
    .sort({ _id: -1 });
  return result;
};

const verifyPayment = async (userEmail: string, order_id: string) => {
  const verifiedPayment = await orderUtils.verifyPaymentAsync(order_id);

  if (verifiedPayment.length) {
    const res = await OrderModel.findOneAndUpdate(
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
        paymentStatus:
          verifiedPayment[0].bank_status == 'Success'
            ? 'paid'
            : verifiedPayment[0].bank_status == 'Failed'
              ? 'pending'
              : verifiedPayment[0].bank_status == 'Cancel'
                ? 'cancelled'
                : '',
      },
      {
        new: true,
      },
    )
      .populate<{ car: Car }>('car')
      .populate<{ userId: IUser }>('userId');
    const mailBody = `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; background-color: #f9f9f9;">
    <h2 style="color: #2c3e50; text-align: center;">🚗 Order Confirmation</h2>
    <p style="font-size: 16px;">Hello <strong>${res?.userId?.firstName} ${res?.userId?.lastName}</strong>,</p>
    <p style="font-size: 16px;">Thank you for your order! Here are your order details:</p>

    <table style="width: 100%; font-size: 15px; border-collapse: collapse; margin-top: 15px;">
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd;"><strong>Order ID:</strong></td>
        <td style="padding: 8px; border: 1px solid #ddd;">${res?._id}</td>
      </tr>
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd;"><strong>Product:</strong></td>
        <td style="padding: 8px; border: 1px solid #ddd;">${res?.car?.brand} - ${res?.car?.model}</td>
      </tr>
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd;"><strong>Category:</strong></td>
        <td style="padding: 8px; border: 1px solid #ddd;">${res?.car?.category}</td>
      </tr>
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd;"><strong>Price:</strong></td>
        <td style="padding: 8px; border: 1px solid #ddd;">${res?.car?.price.toLocaleString()} BDT</td>
      </tr>
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd;"><strong>Quantity:</strong></td>
        <td style="padding: 8px; border: 1px solid #ddd;">${res?.quantity}</td>
      </tr>
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd;"><strong>Total:</strong></td>
        <td style="padding: 8px; border: 1px solid #ddd;"><strong>${res?.totalPrice.toLocaleString()} BDT</strong></td>
      </tr>
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd;"><strong>Status:</strong></td>
        <td style="padding: 8px; border: 1px solid #ddd;">${res?.status}</td>
      </tr>
    </table>

    <p style="margin-top: 20px; font-size: 14px; color: #555;">We will notify you once your product is shipped. If you have any questions, feel free to contact our support.</p>
    
     <p style="font-size: 14px;">
      Regards, <br/><strong>The AutoSphere Team</strong>
    </p>
    
    <div style="margin-top: 20px; text-align: center; font-size: 13px; color: #999;">
      © ${new Date().getFullYear()} Car Store. All rights reserved.
    </div>
  </div>
`;

    sendOrderConfirmationMail(
      'ahmedshohagarfan@gmail.com',
      userEmail,
      `Order Confirmed - ${res?.car?.brand} ${res?.car?.model} | Order ID: ${res?._id}`,
      mailBody,
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
