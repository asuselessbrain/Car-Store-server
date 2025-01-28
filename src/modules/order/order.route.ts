import express from 'express';
import { orderController } from './order.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../userModels/user.constants';
// import { orderController } from './order.controller';

const orderRoute = express.Router();

// orderRoute.post('/create-order', orderController.createOrder);
orderRoute.post('/', orderController.createOrder);
orderRoute.get('/revenue', auth(USER_ROLE.admin), orderController.getRevenue);
orderRoute.get('/', auth(USER_ROLE.admin), orderController.getAllOrders);

export const orderRouter = orderRoute;
