# LAB 15 Project

## Overview

This project is an Express and MongoDB authentication API with:

- Student registration and login
- bcrypt password hashing
- JWT authentication
- Protected profile access
- Admin-only profile access

## Run locally

```powershell
npm install
Copy-Item .env.example .env
npm start
```

MongoDB must be running, and `.env` must contain `MONGODB_URI` and `JWT_SECRET`.

The API is available at `http://localhost:3000`.
