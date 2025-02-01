import mongoose from 'mongoose';
export type IOrder = {
  car: mongoose.Schema.Types.ObjectId;
  userId: mongoose.Schema.Types.ObjectId;
  status: 'in-progress' | 'delivered';
  quantity: number;
  totalPrice: number;
};
