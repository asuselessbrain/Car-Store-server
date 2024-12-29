import mongoose from 'mongoose';
export type Order = {
  email: string;
  car: mongoose.Schema.Types.ObjectId;
  quantity: number;
  totalPrice: number;
};
