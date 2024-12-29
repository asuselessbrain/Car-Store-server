import express from 'express';
import { orderController } from './order.controller';

const orderRoute = express.Router();

// orderRoute.post('/create-order', orderController.createOrder);
orderRoute.post('/create-order', orderController.createOrder);
orderRoute.get('/revenue', orderController.getRevenue);

export const orderRouter = orderRoute;
