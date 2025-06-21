import { z } from 'zod';

export const carValidationSchema = z.object({
  name: z
    .string()
    .min(1, { message: 'Car name is required' }),

  brand: z
    .string()
    .min(1, { message: 'Brand is required' })
    .max(50, { message: 'Brand cannot exceed 50 characters' }),

  model: z
    .string()
    .min(1, { message: 'Model is required' }),

  releaseYear: z
    .number()
    .min(1886, { message: 'Release year must be 1886 or later' })
    .max(new Date().getFullYear(), { message: 'Release year cannot be in the future' }),

  bodyType: z
    .string()
    .min(1, { message: 'Body type is required' }),

  transmission: z
    .string()
    .min(1, { message: 'Transmission is required' }),

  fuelType: z
    .string()
    .min(1, { message: 'Fuel type is required' }),

  engineSize: z
    .string()
    .min(1, { message: 'Engine size is required' }),

  color: z
    .string()
    .min(1, { message: 'Color is required' }),

  price: z
    .number()
    .min(0, { message: 'Price must be a positive number' }),

  quantity: z
    .number()
    .min(1, { message: 'Quantity must be at least 1' }),

  inStock: z.boolean().default(true),

  mileage: z
    .number()
    .min(0, { message: 'Mileage must be a positive number' }),

  features: z
    .array(z.string())
    .optional(),

  description: z
    .string()
    .min(1, { message: 'Description is required' }),

  category: z
    .string()
    .min(1, { message: 'Category is required' }),

  tags: z
    .array(z.string())
    .optional(),
});
