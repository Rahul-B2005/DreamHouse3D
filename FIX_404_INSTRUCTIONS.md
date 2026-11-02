# DreamHome3D login/register 404 fix

## What was wrong
- The frontend is Create React App (`react-scripts start`), but the API proxy was configured only in `vite.config.js`. Create React App ignores that Vite proxy, so `/api/auth/login` and `/api/auth/register` could return a frontend 404.
- The server package scripts started `server.js`, but this project contains `app.js`.

## Run it
1. In `server`, copy `.env.example` to `.env` and set `MONGO_URI` and a new random `JWT_SECRET`.
2. Terminal 1:
   ```powershell
   cd server
   npm install
   npm run dev
   ```
3. Terminal 2:
   ```powershell
   cd client
   npm install
   npm start
   ```
4. Check `http://localhost:5051/api/health`. Expected JSON:
   `{"ok":true,"service":"DreamHome3D API"}`
5. Open the frontend at `http://localhost:3000`, then try register/login again.

The client now uses the Create React App `proxy` setting to forward `/api` to `http://localhost:5051`.
The uploaded `server/.env` was intentionally not included in this fixed ZIP because environment files may contain database credentials and secrets. Create your own from `.env.example`. If the uploaded `.env` contained real credentials, rotate them.
