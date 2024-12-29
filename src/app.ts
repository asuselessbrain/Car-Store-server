import express, { Request, Response } from 'express';
import cors from 'cors';
import { routers } from './modules/carModels/car.router';
import { orderRouter } from './modules/order/order.route';
const app = express();

app.use(express.json());
app.use(cors());

app.use('/api/cars', routers);
app.use('/api/orders', orderRouter);
app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

export default app;
