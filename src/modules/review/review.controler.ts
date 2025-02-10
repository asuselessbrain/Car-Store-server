import { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { responser } from '../../utils/responser';
import { StatusCodes } from 'http-status-codes';
import { reviewServices } from './review.services';

const createReview = catchAsync(async (req: Request, res: Response) => {
  const user = req?.user;
  const payload = req.body;
  payload.userId = user?._id;
  const result = await reviewServices.createReview(payload);
  responser(res, {
    statusCode: StatusCodes.OK,
    message: 'Review posted successfully',
    data: result,
  });
});

const getReview = catchAsync(async (req: Request, res: Response) => {
  const result = await reviewServices.getReview();
  responser(res, {
    statusCode: StatusCodes.OK,
    message: 'Review retrieved successfully',
    data: result,
  });
});

const getSingleUserReview = catchAsync(async (req: Request, res: Response) => {
  const userId = req?.user?._id;
  const result = await reviewServices.singleUserReview(userId);
  responser(res, {
    statusCode: StatusCodes.OK,
    message: 'Review retrieved successfully',
    data: result,
  });
});

export const reviewController = {
  createReview,
  getReview,
  getSingleUserReview,
};
