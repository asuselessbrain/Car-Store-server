export interface Cars {
  name: string,
  brand: string,
  model: string,
  releaseYear: Date,
  bodyType: string,
  transmission: string,
  fuelType: string,
  engineSize: string,
  color: string,

  price: number,
  quantity: number,
  inStock: Boolean,

  images: [string],
  mileage: string,
  features: [string],
  description: string,

  category: string,
  tags: [string],
  warranty?: string;
}
