import { Router } from 'express';
import { createOrder, getOrders } from '../controllers/orderController.js';

export const orderRouter = Router();
orderRouter.get('/', getOrders);
orderRouter.post('/', createOrder);