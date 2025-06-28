import { Request, Response } from 'express';
import { orderServices } from './order.services';
import { catchAsync } from '../../utils/catchAsync';
import { responser } from '../../utils/responser';
import { StatusCodes } from 'http-status-codes';
import { IUser } from '../userModels/user.interface';

const createOrder = catchAsync(async (req: Request, res: Response) => {
  const orders = req.body;
  const userId = req.user;

  // Validate order data
  if (!orders || !orders.car || !orders.quantity) {
    res.status(400).json({
      message: 'Invalid order data. "car", "quantity" are required.',
      success: false,
    });
    return;
  }

  const { car, quantity } = orders;

  // Update car inventory
  const updatedCar = await orderServices.updateCarInventoryInDB(car, quantity);
  if (!updatedCar) {
    res.status(404).json({
      message: 'Car not found or inventory update failed.',
      success: false,
    });
    return;
  }

  // Create the order
  const createdOrder = await orderServices.createOrderInDB(
    userId as IUser,
    orders,
    req.ip!,
  );

  responser(res, {
    statusCode: StatusCodes.OK,
    message: 'Order created successfully',
    data: createdOrder,
  });
});

const verifyPayment = catchAsync(async (req, res) => {
  const userEmail = req?.user?.email;
  const order = await orderServices.verifyPayment(
    userEmail,
    req.query.order_id as string,
  );

  responser(res, {
    statusCode: StatusCodes.CREATED,
    message: 'Order verified successfully',
    data: order,
  });
});

const getAllOrders = catchAsync(async (req: Request, res: Response) => {
  const orders = await orderServices.getAllOrdersFromDB();

  responser(res, {
    statusCode: StatusCodes.OK,
    message: 'Order getting successfully',
    data: orders,
  });
});

const getOrderById = catchAsync(async (req: Request, res: Response) => {
  const userInfo = req.user;

  const id = userInfo?.id;

  const orders = await orderServices.getOrderByIdFromDB(id);

  responser(res, {
    statusCode: StatusCodes.OK,
    message: 'Orders retrieved successfully',
    data: orders,
  });
});

const getRevenue = async (req: Request, res: Response) => {
  try {
    const totalRevenue = await orderServices.calculateTotalRevenue();

    res.status(200).json({
      message: 'Revenue calculated successfully',
      status: true,
      data: {
        totalRevenue,
      },
    });
  } catch (err) {
    res.status(500).json({
      message: 'Failed to calculate revenue',
      status: false,
      error: err,
    });
  }
};

const totalRevenue = async (req: Request, res: Response) => {
  try {
    const totalRevenue = await orderServices.totalRevenue();

    res.status(200).json({
      message: 'Revenue calculated successfully',
      status: true,
      data: {
        totalRevenue,
      },
    });
  } catch (err) {
    res.status(500).json({
      message: 'Failed to calculate revenue',
      status: false,
      error: err,
    });
  }
};

const sellByBrand = async (req: Request, res: Response) => {
  try {
    const sellCountByBrand = await orderServices.sellByBrand();

    res.status(200).json({
      message: 'Sell by brand counted product retrieved successfully',
      status: true,
      data: sellCountByBrand,
    });
  } catch (err) {
    res.status(500).json({
      message: 'Failed to calculate revenue',
      status: false,
      error: err,
    });
  }
};

const updateStatus = catchAsync(async (req: Request, res: Response) => {
  const orderId = req.params.orderId;

  const result = await orderServices.updateStatus(orderId);

  responser(res, {
    statusCode: StatusCodes.OK,
    message: 'Update delivery status successfully',
    data: result,
  });
});

const updateStatusByUser = catchAsync(async (req: Request, res: Response) => {
  const orderId = req.params.orderId;
  // await userService.deleteUser(userId);
  const result = await orderServices.updateStatusByUser(orderId);

  responser(res, {
    statusCode: StatusCodes.OK,
    message: 'Update delivery status successfully',
    data: result,
  });
});

const popularCars = catchAsync(async (req: Request, res: Response) => {
  const result = await orderServices.populerCars();

  responser(res, {
    statusCode: StatusCodes.OK,
    message: 'Popular Cars retrive successfully',
    data: result,
  });
})

export const orderController = {
  createOrder,
  getAllOrders,
  getRevenue,
  getOrderById,
  updateStatusByUser,
  updateStatus,
  sellByBrand,
  totalRevenue,
  verifyPayment,
  popularCars
};
