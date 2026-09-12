const API_URL = 'http://localhost:5000/api';

async function request(path, options = {}) {
  let response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
      ...options,
    });
  } catch {
    throw new Error('We could not reach the store. Please check that the API is running and try again.');
  }
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.message || 'Something went wrong.');
  return payload;
}

export const fetchProducts = () => request('/products');
export const fetchProduct = (id) => request(`/products/${id}`);
export const fetchOrders = (token) => request('/orders', { headers: token ? { Authorization: `Bearer ${token}` } : {} });
export const submitOrder = (order) => request('/orders', { method: 'POST', body: JSON.stringify(order) });