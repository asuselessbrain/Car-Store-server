import { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { responser } from '../../utils/responser';
import { StatusCodes } from 'http-status-codes';
import { reviewServices } from './review.services';

const createReview = catchAsync(async (req: Request, res: Response) => {
  const user = req?.user;
  const payload = req.body;
  payload.userId = user?._id;

  console.log(payload)
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

const getSingleCarReview = catchAsync(async(req: Request, res: Response) => {
  const id = req?.params?.id;
  const result = await reviewServices.getSingleCarReview(id);

  responser(res, {
    statusCode: StatusCodes.OK,
    message: 'Review retrieved successfully',
    data: result,
  });
})

const getSingleUserReview = catchAsync(async (req: Request, res: Response) => {
  const userId = req?.user?._id;
  const result = await reviewServices.singleUserReview(userId);
  responser(res, {
    statusCode: StatusCodes.OK,
    message: 'Review retrieved successfully',
    data: result,
  });
});

const updateUserReview = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.reviewId;
  const updatedReview = req.body;

  const result = await reviewServices.updateUserReview(id, updatedReview);
  res.status(200).json({
    message: 'Review updated successfully',
    success: true,
    data: result,
  });
});

export const reviewController = {
  createReview,
  getReview,
  getSingleUserReview,
  getSingleCarReview,
  updateUserReview
};
