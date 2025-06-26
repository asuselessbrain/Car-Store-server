import mongoose, { model, Schema } from 'mongoose';
import { IReview } from './review.interface';

const reviewSchema = new Schema<IReview>({
  carId: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, 'Car Id is required!'],
    ref: 'Car',
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, 'User Id is required!'],
    ref: 'User',
  },
  ratting: { type: Number, required: [true, 'Ratting is Required!'] },
  comment: {
    type: String,
    required: [true, 'Comment is Required!'],
    minlength: [50, 'Comment must be at least 50 characters long!'],
  },
},
{
  timestamps: true
}
);

export const Review = model<IReview>('review', reviewSchema);
