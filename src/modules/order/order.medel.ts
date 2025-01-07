import mongoose, { model, Schema } from 'mongoose';
import { Order } from './order.interface';

const orderSchema = new Schema<Order>(
  {
    email: { type: String, required: true },
    car: { type: mongoose.Schema.Types.ObjectId, required: true },
    quantity: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
  },
  {
    timestamps: true,
  },
);

export const OrderModel = model<Order>('Order', orderSchema);
