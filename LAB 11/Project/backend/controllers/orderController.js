import { products } from '../data/products.js';
import { orders } from '../data/orders.js';

const response = (success, data, message) => ({ success, ...(data !== undefined ? { data } : {}), ...(message ? { message } : {}) });

function getToken(req) { return req.get('Authorization')?.replace(/^Bearer\s+/i, '') || req.body?.token; }

export function getOrders(req, res) {
  if (!getToken(req)) return res.status(401).json(response(false, undefined, 'Sign in required'));
  return res.json(response(true, orders));
}

export function createOrder(req, res) {
  if (!getToken(req)) return res.status(401).json(response(false, undefined, 'Sign in required'));
  const { items } = req.body || {};
  if (!Array.isArray(items) || items.length === 0) return res.status(400).json(response(false, undefined, 'Your cart is empty'));
  const validatedItems = [];
  for (const item of items) {
    const product = products.find((entry) => entry.id === item.productId);
    if (!product || !Number.isInteger(item.quantity) || item.quantity < 1) return res.status(400).json(response(false, undefined, 'Invalid order item'));
    if (item.quantity > product.stock) return res.status(409).json(response(false, undefined, `Insufficient stock for ${product.name}. Only ${product.stock} units are available.`));
    validatedItems.push({ productId: product.id, name: product.name, price: product.price, quantity: item.quantity });
  }
  const total = validatedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  validatedItems.forEach((item) => { products.find((product) => product.id === item.productId).stock -= item.quantity; });
  const order = { id: `ORD-${String(1024 + orders.length).padStart(4, '0')}`, date: new Date().toISOString(), items: validatedItems, total, status: 'CONFIRMED' };
  orders.unshift(order);
  return res.status(201).json(response(true, order, 'Order placed successfully'));
}