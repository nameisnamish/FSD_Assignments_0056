import express from 'express';
import cors from 'cors';
import { products } from './data/products.js';
import { orders } from './data/orders.js';
import { productRouter } from './routes/productRoutes.js';
import { orderRouter } from './routes/orderRoutes.js';

const app = express();
app.use(cors());
app.use(express.json());

const response = (success, data, message) => ({ success, ...(data !== undefined ? { data } : {}), ...(message ? { message } : {}) });

app.use('/api/products', productRouter);
app.use('/api/orders', orderRouter);
app.use((req, res) => res.status(404).json(response(false, null, 'Endpoint not found')));

app.use((error, req, res, next) => {
  if (error instanceof SyntaxError && error.status === 400 && error.type === 'entity.parse.failed') return res.status(400).json({ success: false, message: 'Request body must be valid JSON' });
  console.error(error);
  return res.status(500).json({ success: false, message: 'Internal server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Noir Atelier API running at http://localhost:${PORT}`));