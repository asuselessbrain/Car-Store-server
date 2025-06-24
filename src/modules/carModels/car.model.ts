import { model, Schema } from 'mongoose';
import { Cars } from './car.interface';

const carSchema = new Schema<Cars>(
  {
    name: { type: String, required: [true, "Car name is required!"] },
    brand: { type: String, required: [true, "Car brand is required!"] },
    model: { type: String, required: [true, "Car model is required!"] },
    releaseYear: { type: Date, required: [true, "Car release year is required!"] },
    bodyType: { type: String, required: [true, "Car body type is required!"] },
    transmission: { type: String, required: [true, "Car transmission is required!"] },
    fuelType: { type: String, required: [true, "Car fuel type is required!"] },
    engineSize: { type: String, required: [true, "Car engine size is required!"] },
    color: { type: String, required: [true, "Car color is required!"] },

    price: { type: Number, required: [true, "Car price is required!"] },
    quantity: { type: Number, required: [true, "Quantity is required!"] },
    inStock: { type: Boolean, default: true },

    images: { type: [String], required: [true, "Please provide your profile picture"] },
    mileage: { type: String, required: [true, "Car mileage is required!"] },
    features: {
      type: [String],
      default: [],
    },
    description: { type: String, required: true },

    category: { type: String, required: [true, "Car category is required!"] },
    tags: {
      type: [String],
      default: [],
    },
    warranty: { type: String}
  },
  {
    timestamps: true,
  }
);

export const CarModel = model<Cars>('Car', carSchema);
