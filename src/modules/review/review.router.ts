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

export default reviewRouter;
