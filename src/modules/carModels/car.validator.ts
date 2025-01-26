import { z } from 'zod';

// Zod schema to validate car data
export const carValidationSchema = z.object({
  brand: z
    .string()
    .min(1, { message: 'Brand is required' })
    .max(50, { message: 'Brand can not cross maximum 50 Characters' }),
  model: z.string().min(1, { message: 'Model is required' }),
  year: z
    .number()
    .min(1886, { message: 'Year must be greater than or equal to 1886' }), // Adjust the lower limit if necessary
  price: z.number().min(0, { message: 'Price must be a positive number' }),
  category: z.string().min(1, { message: 'Category is required' }),
  description: z.string().min(1, { message: 'Description is required' }),
  quantity: z.number().min(1, { message: 'Quantity must be at least 1' }),
  inStock: z.boolean().default(true),
});
