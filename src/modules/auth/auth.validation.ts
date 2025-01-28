import { z } from 'zod';

const loginValidationSchema = z.object({
  body: z.object({
    email: z
      .string({
        required_error: 'Email must be provided and must be a string',
      })
      .email(),
    password: z.string({ required_error: 'Password is required' }),
  }),
});

const passwordChangeValidationSchema = z.object({
  body: z.object({
    oldPassword: z.string({
      required_error: 'Old password is required',
    }),
    newPassword: z.string({ required_error: 'Password is required' }),
  }),
});

export const AuthValidation = {
  loginValidationSchema,
  passwordChangeValidationSchema,
};
