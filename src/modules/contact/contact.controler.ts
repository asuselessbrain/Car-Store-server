import { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { responser } from '../../utils/responser';
import { StatusCodes } from 'http-status-codes';
import { contactService } from './contact.service';

const createContact = catchAsync(async (req: Request, res: Response) => {
  const contactInfo = req.body;
  const email = req?.user?.email;

  const result = await contactService.createContactInDb(email, contactInfo);
  responser(res, {
    statusCode: StatusCodes.CREATED,
    message: 'Contact created successfully',
    data: result,
  });
});

export const contactController = {
  createContact,
};
