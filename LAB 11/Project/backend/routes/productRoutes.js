import { Router } from 'express';
import { getProductById, getProducts } from '../controllers/productController.js';

export const productRouter = Router();
productRouter.get('/', getProducts);
productRouter.get('/:id', getProductById);