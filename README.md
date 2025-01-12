# Car Store Application

## Objective
Develop an Express application with TypeScript, integrating MongoDB with Mongoose to manage a Car Store. Ensure data integrity using Mongoose schema validation.

---

## Live Link
Access the live application here: **[Car Store Application](https://assignment-2-nine-inky.vercel.app/)**

---

## Features
- **Car Management:**
  - Create, read, update, and delete car details.
  - Search cars by brand, model, or category.
  - Manage car inventory with quantity tracking and stock status.
- **Order Management:**
  - Place orders for cars.
  - Automatically adjust inventory on order placement.
  - Prevent orders if stock is insufficient.
- **Revenue Calculation:**
  - Use MongoDB aggregation to calculate total revenue from orders.
- **Validation:**
  - Enforce data integrity with Mongoose schema validation.

---

## Project Setup
### Prerequisites
- Node.js (>=16.x)
- MongoDB instance (local or cloud-based)

### Installation
1. **Clone the repository:**
    ```bash
    git clone https://github.com/asuselessbrain/Car-Store-server.git
    cd Car-Store-server
    ```
2. **Install dependencies:**
    ```bash
    npm install
    ```
3. **Environment Variables:**
    Create a `.env` file in the root directory and add the following:
    ```env
    DB_URI=<your-mongodb-uri>
    PORT=5000
    ```
4. **Start the server:**
    ```bash
    npm run start:dev
    ```
5. **Access the API:**
    Open your browser or API client and navigate to `http://localhost:5000/api/cars`.
---

## Directory Structure
```
src/
├── config
│   ├── index.ts
├── modules
│   ├── carModels
│   │   ├── car.interface.ts
│   │   ├── car.model.ts
│   │   ├── car.router.ts
│   │   ├── car.controller.ts
│   │   ├── car.services.ts
│   ├── order
│   │   ├── order.interface.ts
│   │   ├── order.model.ts
│   │   ├── order.router.ts
│   │   ├── order.controller.ts
│   │   ├── order.services.ts
├── app.ts
├── server.ts
```

---

## Models

### Car Model
```typescript
brand: string  // The brand or manufacturer of the car (e.g., Toyota, BMW, Ford).
model: string  // The model of the car (e.g., Camry, 3 Series, Focus).
year: number   // The year of manufacture.
price: number  // Price of the car.
category: string // Enum: Sedan, SUV, Truck, Coupe, Convertible.
description: string // A brief description of the car's features.
quantity: number // Quantity of the car available.
inStock: boolean // Indicates if the car is in stock.
```

### Order Model
```typescript
email: string // The email address of the customer.
car: ObjectId // The car ordered (reference the Car model).
quantity: number // The quantity of the ordered car.
totalPrice: number // The total price (car price * quantity).
```

---

## API Endpoints

### 1. Create a Car
**Endpoint:** `/api/cars`
**Method:** `POST`
**Request Body:**
```json
{
  "brand": "Toyota",
  "model": "Camry",
  "year": 2024,
  "price": 25000,
  "category": "Sedan",
  "description": "A reliable family sedan with modern features.",
  "quantity": 50,
  "inStock": true
}
```

### 2. Get All Cars
**Endpoint:** `/api/cars`
**Method:** `GET`
**Query Parameters:** `searchTerm`

### 3. Get a Specific Car
**Endpoint:** `/api/cars/:carId`
**Method:** `GET`

### 4. Update a Car
**Endpoint:** `/api/cars/:carId`
**Method:** `PUT`
**Request Body:** Car details to update.

### 5. Delete a Car
**Endpoint:** `/api/cars/:carId`
**Method:** `DELETE`

### 6. Order a Car
**Endpoint:** `/api/orders`
**Method:** `POST`
**Request Body:**
```json
{
  "email": "customer@example.com",
  "car": "carId",
  "quantity": 1,
  "totalPrice": 27000
}
```

### 7. Calculate Revenue from Orders
**Endpoint:** `/api/orders/revenue`
**Method:** `GET`

---

## Revenue Aggregation Logic
- Use MongoDB aggregation pipeline to calculate total revenue.
- Multiply the price of each car by the quantity ordered.
- Return the aggregated result.

---

## Future Enhancements
- Add user authentication.
- Enhance inventory management with notifications for low stock.
- Implement additional analytics features.
