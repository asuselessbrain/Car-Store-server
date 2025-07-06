import express, { Request, Response } from 'express';
import cors from 'cors';
import { routers } from './modules/carModels/car.router';
import { orderRouter } from './modules/order/order.route';
import { globalErrorHandlear } from './globalErrorHandlear/globalErrorHandlear';
import userRouter from './modules/userModels/user.router';
import authRouter from './modules/auth/auth.router';
import cookieParser from 'cookie-parser';
import reviewRouter from './modules/review/review.router';
import contactRouter from './modules/contact/contact.route';
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: [
      'http://localhost:5174',
      'http://localhost:5173',
      'https://car-store-frontend-delta.vercel.app',
      'https://auto-sphere-ashy.vercel.app',
      'exp://192.168.0.18:8081',
      'http://ug2002040.cse.pstu.ac.bd'
    ],
    credentials: true,
  }),
);

app.use('/api/auth', authRouter);
app.use('/api/cars', routers);
app.use('/api/orders', orderRouter);
app.use('/api/user', userRouter);
app.use('/api/review', reviewRouter);
app.use('/api/contact', contactRouter);
app.get('/', (req: Request, res: Response) => {
  res.json({
    Welcome: "Welcome to AutoSphere Backend",
    Developer: "Arfan Ahmed",
    Faculty: "Computer Science and Enginnering",
    University: "Patuakhali Science and Technology University"
  });
});

app.use(globalErrorHandlear);

app.use('*', (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Page not found',
  });
});

export default app;
