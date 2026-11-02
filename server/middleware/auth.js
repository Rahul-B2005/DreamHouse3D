import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export default async function protect(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    if (!header.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Please log in to continue' });
    }
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ message: 'Server JWT_SECRET is not configured' });
    }

    const token = header.slice(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    if (!user) return res.status(401).json({ message: 'Please log in again' });

    req.user = user;
    return next();
  } catch (_error) {
    return res.status(401).json({ message: 'Please log in again' });
  }
}
