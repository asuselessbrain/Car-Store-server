export interface Cars {
  name: String,
  brand: String,
  model: String,
  releaseYear: Date,
  bodyType: String,
  transmission: String,
  fuelType: String,
  engineSize: String,
  color: String,

  price: Number,
  quantity: Number,
  inStock: Boolean,

  images: [String],
  mileage: String,
  features: [String],
  description: String,

  category: String,
  tags: [String],
  warranty?: string;
}
