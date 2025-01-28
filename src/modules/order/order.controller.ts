import { Request, Response } from 'express';
import { orderServices } from './order.services';
import { catchAsync } from '../../utils/catchAsync';
import { responser } from '../../utils/responser';
import { StatusCodes } from 'http-status-codes';

const createOrder = catchAsync(async (req: Request, res: Response) => {
  const orders = req.body;

  // Validate order data
  if (!orders || !orders.car || !orders.quantity) {
    res.status(400).json({
      message: 'Invalid order data. "car" and "quantity" are required.',
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
  const createdOrder = await orderServices.createOrderInDB(orders);

  responser(res, {
    statusCode: StatusCodes.OK,
    message: 'Order created successfully',
    data: createdOrder,
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
    console.error('Error fetching revenue:', err);

    res.status(500).json({
      message: 'Failed to calculate revenue',
      status: false,
      error: err,
    });
  }
};

const getAllOrders = catchAsync(async (req: Request, res: Response) => {
  const orders = await orderServices.getAllOrdersFromDB();

  responser(res, {
    statusCode: StatusCodes.OK,
    message: 'Users getting successfully',
    data: orders,
  });
});

export const orderController = {
  createOrder,
  getAllOrders,
  getRevenue,
};
