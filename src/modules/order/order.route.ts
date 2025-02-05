import express from 'express';
import { orderController } from './order.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../userModels/user.constants';
// import { orderController } from './order.controller';

const orderRoute = express.Router();

// user routes
orderRoute.post('/', auth(USER_ROLE.user), orderController.createOrder);
orderRoute.get(
  '/my-orders',
  auth(USER_ROLE.user),
  orderController.getOrderById,
);

// only for admin
orderRoute.get('/revenue', auth(USER_ROLE.admin), orderController.getRevenue);
orderRoute.get('/', auth(USER_ROLE.admin), orderController.getAllOrders);

orderRoute.put(
  '/update-status/:orderId',
  auth(USER_ROLE.admin),
  orderController.updateStatus,
);
orderRoute.put(
  '/cancel-order/:orderId',
  auth(USER_ROLE.user),
  orderController.updateStatusByUser,
);

export const orderRouter = orderRoute;
