import mongoose from 'mongoose';

export type IReview = {
  userId: mongoose.Schema.Types.ObjectId;
  ratting: number;
  comment: string;
};
