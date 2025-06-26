import { IReview } from './review.interface';
import { Review } from './review.model';

const createReview = async (payload: IReview) => {
  const result = await Review.create(payload);
  return result;
};

const getReview = async () => {
  const result = await Review.find().populate('userId').populate('carId').sort({ _id: -1 });
  return result;
};

const getSingleCarReview = async(id: string) => {
  const result = await Review.find({carId:id}).populate('userId').sort({_id: -1});
  return result;
}

const singleUserReview = async (id: string) => {
  const result = await Review.find({ userId: id }).populate('userId').sort({_id: -1});
  return result;
};

const updateUserReview = async (id: string, data: IReview) => {
  const result = await Review.findOneAndUpdate({_id: id}, data, {new: true})

  return result;
};

const getSingleReviewFromDB = async (id: string) => {
  const result = await Review.findById(id);
  return result;
};

export const reviewServices = { createReview, getReview, singleUserReview, getSingleCarReview, updateUserReview, getSingleReviewFromDB };
