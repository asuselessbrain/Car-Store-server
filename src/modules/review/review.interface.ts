import mongoose from 'mongoose';

export type IReview = {
  _id?: string;
  carId: mongoose.Schema.Types.ObjectId;
  userId: mongoose.Schema.Types.ObjectId;
  ratting: number;
  comment: string;
};
