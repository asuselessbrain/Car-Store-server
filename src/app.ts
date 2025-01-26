import express, { Request, Response } from 'express';
import cors from 'cors';
import { routers } from './modules/carModels/car.router';
import { orderRouter } from './modules/order/order.route';
import { globalErrorHandlear } from './globalErrorHandlear/globalErrorHandlear';
const app = express();

app.use(express.json());
app.use(cors());

app.use('/api/cars', routers);
app.use('/api/orders', orderRouter);
app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

app.use(globalErrorHandlear);

app.use('*', (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Page not found',
  });
});

export default app;
