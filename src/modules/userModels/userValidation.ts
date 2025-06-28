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
    }),

    dob: z.coerce.date({ required_error: 'Date of birth is required' }),

    district: z
      .string({ required_error: 'District is required' })
      .min(5, 'District must be at least 5 characters'),
    
    upazila: z
      .string({ required_error: 'Upazila is required' })
      .min(5, 'Upazila must be at least 5 characters'),

    postOffice: z
      .string({ required_error: 'Post Office is required' })
      .min(5, 'Post Office must be at least 5 characters'),

    postalCode: z
      .string({ required_error: 'Postal Code is required' })
      .min(5, 'Postal Code must be at least 5 characters'),
    
    about: z
      .string({ required_error: 'About is required' })
      .min(5, 'About must be at least 5 characters'),

    password: z
      .string({ required_error: 'Password is required' })
      .min(6, 'Password must be at least 6 characters')
      .max(20, 'Password must be at most 20 characters'),

    role: z
      .enum(['user', 'admin'])
      .default('user'),

    userStatus: z
      .enum(['active', 'blocked'])
      .default('active'),

    verified: z
      .boolean()
      .default(false),


    loginVerification: z
      .boolean()
      .default(false),
  }),
});

export const UserValidation = {
  userValidationSchema,
};
