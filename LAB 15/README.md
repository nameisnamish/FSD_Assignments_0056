# Lab 15: User Authentication System

An Express and MongoDB authentication API implementing registration, bcrypt password hashing, JWT login, protected profile access, and role-based authorization.

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env` and set `MONGODB_URI` and a strong `JWT_SECRET`.
3. Start MongoDB.
4. Run the server:

   ```bash
   npm start
   ```

The API runs on `http://localhost:3000` by default.

## Routes

| Method | Route | Authentication | Purpose |
| --- | --- | --- | --- |
| GET | `/api/health` | None | Health check |
| POST | `/api/auth/register` | None | Register a student account |
| POST | `/api/auth/login` | None | Verify credentials and return a JWT |
| GET | `/api/profile` | Bearer JWT | Return the authenticated user's profile |
| GET | `/api/profile/admin` | Admin Bearer JWT | Demonstrate role-protected access |

Send the token returned by registration or login in this format:

```text
Authorization: Bearer <token>
```

Admin accounts should be created or promoted by an administrator directly in MongoDB; public registration never accepts the admin role.
