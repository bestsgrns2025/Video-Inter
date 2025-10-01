// Load environment variables
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth.routes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Root route
app.get('/', (req, res) => {
  res.send('🚀 Server is running on Render!');
});

// Test MongoDB route
app.get('/test-db', async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    res.json({ collections });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Auth routes
app.use('/api/auth', authRoutes);

// ✅ Use Render's PORT
const PORT = process.env.PORT || 5000;

// ✅ MongoDB URI check
const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error("❌ MONGO_URI is missing! Set it in Render Environment Variables or .env file.");
  process.exit(1);
}

// ✅ Connect to MongoDB, then start server
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ MongoDB connected successfully');

  // ✅ IMPORTANT: Bind to 0.0.0.0 for Render
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
  });
})
.catch(err => {
  console.error('❌ MongoDB connection error:', err.message);
});

// Debug logs
console.log("🔹 Loaded Environment Variables:");
console.log({
  PORT: process.env.PORT,
  MONGO_URI: MONGO_URI ? "Loaded ✅" : "Missing ❌",
  JWT_SECRET: process.env.JWT_SECRET ? "Loaded ✅" : "Missing ❌",
  EMAIL_HOST: process.env.EMAIL_HOST || "Not Set",
  EMAIL_USER: process.env.EMAIL_USER || "Not Set",
});
