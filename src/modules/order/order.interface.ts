import mongoose from 'mongoose';
export type IOrder = {
  email: string;
  car: mongoose.Schema.Types.ObjectId;
  quantity: number;
  totalPrice: number;
};
