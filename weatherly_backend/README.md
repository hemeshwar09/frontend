# Weatherly - Backend (Express + MongoDB)

## Overview
This is a simple backend for the Weatherly frontend. It provides:
- Current weather and 5-day forecast proxy endpoints using OpenWeatherMap.
- Simple MongoDB-backed user preferences/search history (no auth included).

## Quick start
1. Copy `env.example` to `.env` and fill in `MONGO_URI` and `OPENWEATHER_API_KEY`.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start server:
   ```bash
   npm run dev
   ```
4. Local MongoDB with Docker (optional):
   If you have Docker installed you can run a local MongoDB with the included Docker Compose file.
   From the `weatherly_backend` folder:
   ```powershell
   # start MongoDB in background
   docker-compose up -d

   # verify Mongo is running (optional)
   docker-compose ps
   ```
   The service maps MongoDB to host port 27017, so you can keep `MONGO_URI` as:
   ```text
   mongodb://localhost:27017/weatherly
   ```
   Then start the server as usual:
   ```powershell
   npm start
   ```
4. Endpoints:
   - `GET /api/weather/current?city=London&units=metric`
   - `GET /api/weather/forecast?lat=...&lon=...`
   - `POST /api/preferences`  (body: `{ city, units, userId? }`)
   - `GET /api/preferences?userId=...`

## Notes
- The weather endpoints act as a proxy so you don't have to expose the API key in the frontend.
- If you want authentication, add an auth layer and store `userId` after login.
