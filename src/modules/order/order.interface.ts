import mongoose from 'mongoose';
export type IOrder = {
  car: mongoose.Schema.Types.ObjectId;
  userId: mongoose.Schema.Types.ObjectId;
  status: 'in-progress' | 'delivered' | 'paid' | 'pending' | 'cancelled';
  paymentStatus: 'paid' | 'pending' | 'cancelled';
  quantity: number;
  totalPrice: number;
  transaction: {
    id: string;
    transactionStatus: string;
    bank_status: string;
    sp_code: string;
    sp_message: string;
    method: string;
    date_time: string;
  };
};
