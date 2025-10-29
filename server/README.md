# Server (Express + MongoDB)

This folder contains a small Express backend for the project using MongoDB (Mongoose).

Quick start

1. Copy `.env.example` to `.env` and fill in `MONGODB_URI` and `JWT_SECRET`.
2. From `project/server` run:

```powershell
npm install
npm run dev
```

API endpoints

- GET / -> health check
- POST /api/auth/signup -> register (body: name, email, password)
- POST /api/auth/signin -> login (body: email, password)
- GET /api/salons -> list salons
- GET /api/salons/:id -> salon detail
- POST /api/salons -> create salon (requires Authorization: Bearer <token>)

Notes

- The server expects a valid `MONGODB_URI`. If not set, the server will exit with an error.
- Routes and models are in `src/routes` and `src/models`.
# Backend (Express + MongoDB)

Quick start:

1. Copy `.env.sample` to `.env` and update values.
2. Install dependencies: `npm install`.
3. Run in dev: `npm run dev`.

Endpoints:
- GET /health - simple health check
- POST /api/auth/signup - create user { name, email, password }
- POST /api/auth/signin - login { email, password }
- GET /api/salons - list salons
- GET /api/salons/:id - salon detail
