import 'dotenv/config';
import 'express-async-errors';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import auth from './routes/auth.js';
import projects from './routes/projects.js';
import rooms from './routes/rooms.js';
import ai from './routes/ai.js';
import estimate from './routes/estimate.js';
import admin from './routes/admin.js';

const app = express();
const PORT = Number(process.env.PORT) || 5051;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000';

app.use(cors({ origin: CLIENT_URL }));
app.use(express.json({ limit: '10mb' }));

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'DreamHome3D API' });
});

app.use('/api/auth', auth);
app.use('/api/projects', projects);
app.use('/api', rooms);
app.use('/api/ai', ai);
app.use('/api/estimate', estimate);
app.use('/api/admin', admin);

app.use('/api', (req, res) => {
  res.status(404).json({ message: `API endpoint not found: ${req.method} ${req.originalUrl}` });
});

app.use((err, _req, res, _next) => {
  console.error('API error:', err);
  if (err.name === 'CastError') return res.status(404).json({ message: 'Project or record not found' });
  res.status(err.status || 500).json({ message: err.message || 'Server error' });
});

async function start() {
  if (!process.env.MONGO_URI) {
    console.error('Missing MONGO_URI. Copy server/.env.example to server/.env and configure MongoDB.');
    process.exit(1);
  }
  if (!process.env.JWT_SECRET) {
    console.error('Missing JWT_SECRET. Add a random secret to server/.env.');
    process.exit(1);
  }
  try {
    await mongoose.connect(process.env.MONGO_URI);
    app.listen(PORT, () => console.log(`DreamHome3D API running at http://localhost:${PORT}`));
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  }
}

start();
