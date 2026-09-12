import { products } from '../data/products.js';

const response = (success, data, message) => ({ success, ...(data !== undefined ? { data } : {}), ...(message ? { message } : {}) });

export function getProducts(req, res) { return res.json(response(true, products)); }

export function getProductById(req, res) {
  const product = products.find((item) => item.id === req.params.id);
  if (!product) return res.status(404).json(response(false, undefined, 'Product not found'));
  return res.json(response(true, product));
}