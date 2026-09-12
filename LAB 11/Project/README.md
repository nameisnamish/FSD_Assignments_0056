# Noir Atelier Commerce

A premium editorial mini e-commerce application built with React, Vite, Node.js, and Express. Product data comes from the backend API; cart state is persisted in localStorage and orders are validated again on the server.

## Run locally

```bash
cd backend
npm install
npm start
```

In another terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend runs on `http://localhost:5173` and the API on `http://localhost:5000`.

## API

- `GET /api/products`
- `GET /api/products/:id`
- `POST /api/orders`
- `GET /api/orders`

Order creation and history require the demo session token. The frontend sends it as `Authorization: Bearer <token>` for history and includes it in the order request.

## Concepts demonstrated

React Router pages, reusable props-based components, `useState`, `useEffect`, controlled forms, conditional rendering, loading/error states, centralized auth/cart context, API integration, stock validation, and responsive CSS.
