import express from 'express';
import { reviewController } from './review.controler';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../userModels/user.constants';

const reviewRouter = express.Router();

reviewRouter.post(
  '/create-review',
  auth(USER_ROLE.user),
  reviewController.createReview,
);

reviewRouter.get('/get-review', reviewController.getReview);
reviewRouter.get(
  '/get-single-user-review',
  auth(USER_ROLE.user),
  reviewController.getSingleUserReview,
);

export default reviewRouter;
