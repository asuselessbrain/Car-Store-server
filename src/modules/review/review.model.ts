import mongoose, { model, Schema } from 'mongoose';
import { IReview } from './review.interface';

const reviewSchema = new Schema<IReview>({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, 'User Id is required!'],
    ref: 'User',
  },
  ratting: { type: Number, required: [true, 'Ratting is Required!'] },
  comment: {
    type: String,
    required: [true, 'Comment is Required!'],
    minlength: 5,
    maxlength: 80,
  },
});

export const Review = model<IReview>('review', reviewSchema);
