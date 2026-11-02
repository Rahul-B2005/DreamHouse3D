import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import protect from '../middleware/auth.js';

const r = Router();

const sign = (user) => jwt.sign(
  { id: user._id },
  process.env.JWT_SECRET,
  { expiresIn: '7d' }
);

const pub = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
});

r.post('/register', async (req, res) => {
  try {
    const name = typeof req.body.name === 'string' ? req.body.name.trim() : '';
    const email = typeof req.body.email === 'string' ? req.body.email.trim().toLowerCase() : '';
    const password = req.body.password;

    if (!name || !/^\S+@\S+\.\S+$/.test(email) || typeof password !== 'string' || password.length < 6) {
      return res.status(400).json({ message: 'Name, valid email and 6+ character password required' });
    }

    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ message: 'Email already registered' });

    const user = await User.create({ name, email, password: await bcrypt.hash(password, 12) });
    return res.status(201).json({ token: sign(user), user: pub(user) });
  } catch (error) {
    console.error('Register error:', error.message);
    if (error.code === 11000) return res.status(409).json({ message: 'Email already registered' });
    return res.status(500).json({ message: 'Registration failed. Check the server terminal.' });
  }
});

r.post('/login', async (req, res) => {
  try {
    const email = typeof req.body.email === 'string' ? req.body.email.trim().toLowerCase() : '';
    const password = req.body.password;
    if (!email || typeof password !== 'string' || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user || typeof user.password !== 'string' || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    return res.json({ token: sign(user), user: pub(user) });
  } catch (error) {
    console.error('Login error:', error.message);
    return res.status(500).json({ message: 'Login failed. Check the server terminal.' });
  }
});

r.get('/profile', protect, (req, res) => res.json(pub(req.user)));

export default r;
