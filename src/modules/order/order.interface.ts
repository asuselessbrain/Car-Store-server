import mongoose from 'mongoose';
export type IOrder = {
  car: mongoose.Schema.Types.ObjectId;
  userId: mongoose.Schema.Types.ObjectId;
  quantity: number;
  totalPrice: number;
};
