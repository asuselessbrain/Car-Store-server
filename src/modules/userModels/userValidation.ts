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

    gender: z.enum(['male', 'female', 'others'], {
      required_error: 'Gender is required',
      invalid_type_error: 'Gender must be male, female, or others',
    }),

    dob: z.coerce.date({ required_error: 'Date of birth is required' }),

    address: z
      .string({ required_error: 'Address is required' })
      .min(5, 'Address must be at least 5 characters'),

    password: z
      .string({ required_error: 'Password is required' })
      .min(6, 'Password must be at least 6 characters')
      .max(20, 'Password must be at most 20 characters'),

    role: z.enum(['user', 'admin'], {
      required_error: 'Role is required',
      invalid_type_error: 'Role must be either user or admin',
    }),

    userStatus: z.enum(['active', 'inactive'], {
      required_error: 'User status is required',
      invalid_type_error: 'User status must be active or inactive',
    }),

    otp: z
      .string({ required_error: 'OTP is required' })
      .min(4, 'OTP must be at least 4 characters'),

    verified: z.boolean({
      required_error: 'Verified field must be a boolean',
    }),

    otpExpire: z.coerce.date({
      required_error: 'OTP expiration time is required',
    }),

    loginVerification: z.boolean({
      required_error: 'Login verification field must be a boolean',
    }),
  }),
});

export const UserValidation = {
  userValidationSchema,
};
