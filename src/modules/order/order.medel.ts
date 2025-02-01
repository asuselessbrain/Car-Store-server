import mongoose, { model, Schema } from 'mongoose';
import { IOrder } from './order.interface';

const orderSchema = new Schema<IOrder>(
  {
    car: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Car',
      required: [true, 'Car ID is Required'],
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    status: {
      type: String,
      enum: {
        values: ['in-progress', 'delivered'],
        message: '{VALUE} is not valid, please provide a valid status',
      },
      default: 'in-progress',
      required: true,
    },
    quantity: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
  },
  {
    timestamps: true,
  },
);

export const OrderModel = model<IOrder>('Order', orderSchema);
