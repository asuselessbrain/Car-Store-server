import { z } from 'zod';

export const userValidationSchema = z.object({
  body: z.object({
    name: z
      .string({
        required_error: 'Name must be provided and must be a string',
      })
      .min(3)
      .max(50),

    email: z
      .string({
        required_error: 'Email must be provided and must be a string',
      })
      .email(),

    password: z
      .string({
        required_error: 'Password is required for your safety',
      })
      .max(20, { message: 'Password can not be more than 20 characters' }),

    age: z.number().int().positive().optional(),

    photo: z
      .string({
        required_error: 'Photo must be provided and must be a string',
      })
      .optional(),
  }),
});

export const UserValidation = {
  userValidationSchema,
};
