import express from 'express';
import { orderController } from './order.controller';

const orderRoute = express.Router();

orderRoute.post('/create-order', orderController.createOrder);

export const orderRouter = orderRoute;
