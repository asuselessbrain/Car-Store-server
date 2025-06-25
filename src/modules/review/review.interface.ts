import mongoose from 'mongoose';

export type IReview = {
  carId: mongoose.Schema.Types.ObjectId;
  userId: mongoose.Schema.Types.ObjectId;
  ratting: number;
  comment: string;
};
