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
        values: ['pending', 'paid', 'in-progress', 'delivered', 'cancelled'],
        message: '{VALUE} is not valid, please provide a valid status',
      },
      default: 'in-progress',
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: {
        values: ['pending', 'paid', 'cancelled'],
        message: '{VALUE} is not valid, please provide a valid payment',
      },
      default: 'pending',
      required: true,
    },
    transaction: {
      id: String,
      transactionStatus: String,
      bank_status: String,
      sp_code: String,
      sp_message: String,
      method: String,
      date_time: String,
    },
    quantity: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
  },
  {
    timestamps: true,
  },
);

export const OrderModel = model<IOrder>('Order', orderSchema);
