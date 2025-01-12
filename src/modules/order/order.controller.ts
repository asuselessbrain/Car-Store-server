import { Request, Response } from 'express';
import { orderServices } from './order.services';

const createOrder = async (req: Request, res: Response) => {
  try {
    const orders = req.body;

    // Validate order data
    if (!orders || !orders.car || !orders.quantity) {
      return res.status(400).json({
        message: 'Invalid order data. "car" and "quantity" are required.',
        success: false,
      });
    }

    const { car, quantity } = orders;

    // Update car inventory
    const updatedCar = await orderServices.updateCarInventoryInDB(
      car,
      quantity,
    );
    if (!updatedCar) {
      return res.status(404).json({
        message: 'Car not found or inventory update failed.',
        success: false,
      });
    }

    // Create the order
    const createdOrder = await orderServices.createOrderInDB(orders);

    res.status(200).json({
      message: 'Order created successfully',
      success: true,
      data: createdOrder,
    });
  } catch (err) {
    console.error('Error during order creation:', err);

    res.status(500).json({
      message: 'Order creation failed',
      success: false,
      error: err,
    });
  }
};

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

export const orderController = {
  createOrder,
  getRevenue,
};
