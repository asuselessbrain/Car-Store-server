import { PipelineStage } from 'mongoose';
import QueryBuilder from '../../builder/QueryBuilder';
import config from '../../config';
import sendOrderConfirmationMail from '../../utils/nodemainle';
import { Cars } from '../carModels/car.interface';
import { CarModel } from '../carModels/car.model';
import { IUser } from '../userModels/user.interface';
import { IOrder } from './order.interface';
import { OrderModel } from './order.medel';
import { orderUtils } from './order.utils';
import puppeteer from 'puppeteer';

export async function generatePdfBuffer(html: string): Promise<Buffer> {
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'networkidle0' });

  const pdfData = await page.pdf({
    format: 'A4',
    printBackground: true,
    margin: { top: '10mm', right: '10mm', bottom: '10mm', left: '10mm' },
  });

  await browser.close();

  return Buffer.from(pdfData); // <-- ✅ fix here
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
  const return_url = config.sp.sp_return_url

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
    return_url,
  };

  console.log(spPayload);

  const payment = await orderUtils.paymentResult(
    spPayload
  );

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

const getAllOrdersFromDB = async (payload: Record<string, any>) => {
  const {
    searchTerm = '',
    page = 1,
    limit = 10,
    sortBy = 'createdAt',
    sortOrder = 'desc',
    status,
    paymentStatus,
  } = payload;

  const skip = (Number(page) - 1) * Number(limit);

  const sortStage: PipelineStage.Sort = {
    $sort: {
      [String(sortBy)]: sortOrder === 'desc' ? -1 : 1,
    },
  };

  const matchConditions: Record<string, any> = {};

  // Search by user email
  if (searchTerm) {
    matchConditions['user.email'] = { $regex: searchTerm, $options: 'i' };
  }

  // Filter by status
  if (status) {
    matchConditions['status'] = status;
  }

  // Filter by paymentStatus
  if (paymentStatus) {
    matchConditions['paymentStatus'] = paymentStatus;
  }

  // Main data query pipeline
  const pipeline: PipelineStage[] = [
    {
      $lookup: {
        from: 'users',
        localField: 'userId',
        foreignField: '_id',
        as: 'user',
      },
    },
    { $unwind: '$user' },
    {
      $lookup: {
        from: 'cars',
        localField: 'car',
        foreignField: '_id',
        as: 'car',
      },
    },
    { $unwind: '$car' },
    { $match: matchConditions },
    sortStage,
    { $skip: skip },
    { $limit: Number(limit) },
  ];

  const data = await OrderModel.aggregate(pipeline);

  // Count query pipeline (same filters and joins)
  const countPipeline: PipelineStage[] = [
    {
      $lookup: {
        from: 'users',
        localField: 'userId',
        foreignField: '_id',
        as: 'user',
      },
    },
    { $unwind: '$user' },
    {
      $lookup: {
        from: 'cars',
        localField: 'car',
        foreignField: '_id',
        as: 'car',
      },
    },
    { $unwind: '$car' },
    { $match: matchConditions },
    { $count: 'total' },
  ];

  const totalResult = await OrderModel.aggregate(countPipeline);
  const totalCount = totalResult[0]?.total || 0;

  return {
    meta: {
      page: Number(page),
      limit: Number(limit),
      total: totalCount,
      totalPage: Math.ceil(totalCount / Number(limit)),
    },
    result: data,
  };
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
      .populate<{ car: Cars }>('car')
      .populate<{ userId: IUser }>('userId');

//     const invoiceHtml = `
// <!DOCTYPE html>
// <html>
// <head>
//   <meta charset="utf-8" />
//   <title>Invoice</title>
//   <style>
//     body { font-family: Arial, sans-serif; background-color: #f9f9f9; }
//     .invoice-box {
//       max-width: 800px;
//       margin: auto;
//       padding: 30px;
//       border: 1px solid #eee;
//       background: #fff;
//       font-size: 14px;
//     }
//     table {
//       width: 100%;
//       line-height: inherit;
//       text-align: left;
//       border-collapse: collapse;
//     }
//     td, th {
//       padding: 8px;
//       border: 1px solid #ddd;
//     }
//     .logo {
//       text-align: center;
//       margin-bottom: 20px;
//     }
//     .footer {
//       margin-top: 30px;
//       font-size: 13px;
//       color: #555;
//     }
//   </style>
// </head>
// <body>
//   <div class="invoice-box">
//     <div class="logo">
//       <img src="https://i.ibb.co/GfMpgKfV/logo.png" alt="AutoSphere Logo" width="120" />
//     </div>
//     <h2 style="text-align: center;">Invoice - AutoSphere</h2>
    
//     <p><strong>Name:</strong> ${res?.userId?.firstName} ${res?.userId?.lastName}</p>
//     <p><strong>Email:</strong> ${res?.userId?.email}</p>
//     <p><strong>Order ID:</strong> ${res?._id}</p>

//     <table>
//       <thead>
//         <tr>
//           <th>Car</th>
//           <th>Brand</th>
//           <th>Category</th>
//           <th>Unit Price</th>
//           <th>Quantity</th>
//           <th>Total</th>
//         </tr>
//       </thead>
//       <tbody>
//         <tr>
//           <td>${res?.car?.name}</td>
//           <td>${res?.car?.brand}</td>
//           <td>${res?.car?.category}</td>
//           <td>${res?.car?.price.toLocaleString()} BDT</td>
//           <td>${res?.quantity}</td>
//           <td><strong>${res?.totalPrice.toLocaleString()} BDT</strong></td>
//         </tr>
//       </tbody>
//     </table>

//     <p><strong>Status:</strong> ${res?.status}</p>
//     <p>Thank you for your purchase!</p>

//     <div class="footer">
//       <p><strong>Issued by:</strong> AutoSphere</p>
//       <p><strong>Date:</strong> ${new Date().toLocaleDateString('en-BD', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
//       <p><strong>Contact:</strong> support@autosphere.com | +8801XXXXXXXXX</p>
//       <p>We appreciate your business. Please reach out if you have any questions or concerns.</p>
//     </div>
//   </div>
// </body>
// </html>
// `;

//     const pdfBuffer = await generatePdfBuffer(invoiceHtml);

//     const mailBody = `
//   <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; background-color: #f9f9f9;">
//     <h2 style="color: #2c3e50; text-align: center;">🚗 Order Confirmation</h2>
//     <p style="font-size: 16px;">Hello <strong>${res?.userId?.firstName} ${res?.userId?.lastName}</strong>,</p>
//     <p style="font-size: 16px;">Thank you for your order! Here are your order details:</p>

//     <table style="width: 100%; font-size: 15px; border-collapse: collapse; margin-top: 15px;">
//       <tr>
//         <td style="padding: 8px; border: 1px solid #ddd;"><strong>Order ID:</strong></td>
//         <td style="padding: 8px; border: 1px solid #ddd;">${res?._id}</td>
//       </tr>
//       <tr>
//         <td style="padding: 8px; border: 1px solid #ddd;"><strong>Product:</strong></td>
//         <td style="padding: 8px; border: 1px solid #ddd;">${res?.car?.brand} - ${res?.car?.model}</td>
//       </tr>
//       <tr>
//         <td style="padding: 8px; border: 1px solid #ddd;"><strong>Category:</strong></td>
//         <td style="padding: 8px; border: 1px solid #ddd;">${res?.car?.category}</td>
//       </tr>
//       <tr>
//         <td style="padding: 8px; border: 1px solid #ddd;"><strong>Price:</strong></td>
//         <td style="padding: 8px; border: 1px solid #ddd;">${res?.car?.price.toLocaleString()} BDT</td>
//       </tr>
//       <tr>
//         <td style="padding: 8px; border: 1px solid #ddd;"><strong>Quantity:</strong></td>
//         <td style="padding: 8px; border: 1px solid #ddd;">${res?.quantity}</td>
//       </tr>
//       <tr>
//         <td style="padding: 8px; border: 1px solid #ddd;"><strong>Total:</strong></td>
//         <td style="padding: 8px; border: 1px solid #ddd;"><strong>${res?.totalPrice.toLocaleString()} BDT</strong></td>
//       </tr>
//       <tr>
//         <td style="padding: 8px; border: 1px solid #ddd;"><strong>Status:</strong></td>
//         <td style="padding: 8px; border: 1px solid #ddd;">${res?.status}</td>
//       </tr>
//     </table>

//     <p style="margin-top: 20px; font-size: 14px; color: #555;">We will notify you once your product is shipped. If you have any questions, feel free to contact our support.</p>
    
//      <p style="font-size: 14px;">
//       Regards, <br/><strong>The AutoSphere Team</strong>
//     </p>
    
//     <div style="margin-top: 20px; text-align: center; font-size: 13px; color: #999;">
//       © ${new Date().getFullYear()} Car Store. All rights reserved.
//     </div>
//   </div>
// `;

//     await sendOrderConfirmationMail(
//       'ahmedshohagarfan@gmail.com',
//       userEmail,
//       `Order Confirmed - ${res?.car?.brand} ${res?.car?.model} | Order ID: ${res?._id}`,
//       mailBody,
//       {
//         filename: `Invoice-${res?._id}.pdf`,
//         content: pdfBuffer,
//       },
//     );
  }
  return verifiedPayment;
};

const populerCars = async () => {
  const result = await OrderModel.aggregate([
    { $group: { _id: '$car', totalQuantity: { $sum: '$quantity' } } },
    {
      $lookup: {
        from: 'cars',
        foreignField: '_id',
        localField: '_id',
        as: 'carDetails',
      },
    },
    {
      $unwind: '$carDetails',
    },
    {
      $sort: { totalQuantity: -1 },
    },
  ]).limit(8);
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
  verifyPayment,
  populerCars,
};
