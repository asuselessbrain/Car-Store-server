import { z } from 'zod';

export const userValidationSchema = z.object({
  body: z.object({
    firstName: z
      .string({ required_error: 'First name is required' })
      .min(3, 'First name must be at least 3 characters')
      .max(20, 'First name can be at most 20 characters'),

    lastName: z
      .string({ required_error: 'Last name is required' })
      .min(3, 'Last name must be at least 3 characters')
      .max(20, 'Last name can be at most 20 characters'),

    email: z
      .string({ required_error: 'Email is required' })
      .email('Invalid email address'),

    phoneNumber: z
      .string({ required_error: 'Phone number is required' })
      .regex(/^01[3-9]\d{8}$/, 'Invalid Bangladeshi phone number'),

    password: z
      .string({ required_error: 'Password is required' })
      .min(6, 'Password must be at least 6 characters')
      .max(20, 'Password must be at most 20 characters'),

    role: z.enum(['user', 'admin']).default('user'),

    userStatus: z.enum(['active', 'blocked']).default('active'),
  }),
});

export const UserValidation = {
  userValidationSchema,
};
