# Jadoo Travel Page

A responsive travel agency landing page built with React and Vite, with an Express API for newsletter subscriptions.

## Features

- Travel landing page with services, destinations, trip booking steps, testimonials, and footer navigation.
- Responsive layout styled with CSS.
- Newsletter subscription form connected to the Express API.
- Optional MongoDB persistence for subscriber emails.
- Health-check endpoint for the API.

## Project structure

```text
Travel Page/
├── client/      # React + Vite frontend
├── server/      # Express API
└── Reffrence/   # Design reference images
```

## Requirements

- Node.js 18 or newer
- npm
- MongoDB (optional)

## Setup

From the `Travel Page` directory, install dependencies:

```bash
npm install
npm --prefix client install
```

Start the frontend and API together:

```bash
npm run dev
```

The frontend runs on the Vite development URL, usually `http://localhost:5173`, and the API runs on `http://localhost:5000`.

To start only one part of the application:

```bash
npm run client
npm run server
```

## MongoDB persistence

Without configuration, subscriptions are stored in memory while the server is running. To persist them in MongoDB, set `MONGODB_URI` before starting the server:

```bash
$env:MONGODB_URI="mongodb://127.0.0.1:27017/jadoo"
npm run server
```

## API endpoints

### `GET /api/health`

Returns the API service status.

### `POST /api/subscribe`

Accepts a JSON body containing an email address:

```json
{
  "email": "traveler@example.com"
}
```

## Production build

Build the frontend with:

```bash
npm run build
```
