// server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth.routes');

const app = express();

// ---------------------- CORS Setup ----------------------
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:5173',
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); // curl/Postman
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      console.warn('Blocked CORS request from:', origin);
      return callback(null, false);
    }
  },
  credentials: true,
}));

// ---------------------- Middleware ----------------------
app.use(express.json());

// ---------------------- Routes ----------------------
app.get('/', (_req, res) => {
  res.send('🚀 Server is running on Render!');
});

// Test MongoDB connection
app.get('/test-db', async (_req, res) => {
  try {
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    res.json({ collections });
  } catch (err) {
    console.error('💥 DB Test Error:', err);
    res.status(500).json({ msg: err.message });
  }
});

// Auth routes
app.use('/api/auth', authRoutes);

// ---------------------- Server & MongoDB ----------------------
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error('❌ MONGO_URI is missing in env variables!');
  process.exit(1);
}

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('✅ MongoDB connected successfully');
    // Bind to 0.0.0.0 for Render
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
  });

// ---------------------- Debug Env ----------------------
console.log('🔹 Loaded Environment Variables:');
console.log({
  PORT,
  MONGO_URI: MONGO_URI ? 'Loaded ✅' : 'Missing ❌',
  JWT_SECRET: process.env.JWT_SECRET ? 'Loaded ✅' : 'Missing ❌',
  FRONTEND_URL: process.env.FRONTEND_URL || 'Not Set',
  EMAIL_HOST: process.env.EMAIL_HOST || 'Not Set',
  EMAIL_USER: process.env.EMAIL_USER || 'Not Set',
});
