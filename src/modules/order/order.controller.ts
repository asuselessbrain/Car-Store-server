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
  );

  responser(res, {
    statusCode: StatusCodes.OK,
    message: 'Order created successfully',
    data: createdOrder,
  });
});

const getAllOrders = catchAsync(async (req: Request, res: Response) => {
  const orders = await orderServices.getAllOrdersFromDB();

  responser(res, {
    statusCode: StatusCodes.OK,
    message: 'Users getting successfully',
    data: orders,
  });
});

const getOrderByEmail = catchAsync(async (req: Request, res: Response) => {
  const email = req.params.email;

  const orders = await orderServices.getOrderByEmailFromDB(email);

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

const updateStatus = catchAsync(async (req: Request, res: Response) => {
  const orderId = req.params.orderId;
  // await userService.deleteUser(userId);
  const result = await orderServices.updateStatus(orderId);

  responser(res, {
    statusCode: StatusCodes.OK,
    message: 'Role Updated Successfully',
    data: result,
  });
});

export const orderController = {
  createOrder,
  getAllOrders,
  getRevenue,
  getOrderByEmail,
  updateStatus,
};
