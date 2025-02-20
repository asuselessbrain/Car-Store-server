import { IReview } from './review.interface';
import { Review } from './review.model';

const createReview = async (payload: IReview) => {
  const result = await Review.create(payload);
  return result;
};

const getReview = async () => {
  const result = await Review.find().populate('userId').sort({ _id: -1 });
  return result;
};

const singleUserReview = async (id: string) => {
  const result = await Review.find({ userId: id });
  return result;
};

export const reviewServices = { createReview, getReview, singleUserReview };
