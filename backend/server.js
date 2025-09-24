// Load environment variables
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const authRoutes = require('./routes/auth.routes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Root route
app.get('/api', (req, res) => {
  res.send('✅ API is running!');
});

// Test MongoDB route
app.get('/api/test-db', async (req, res) => {
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

// -------------------
// Serve frontend (React build)
// -------------------
const clientDistPath = path.join(__dirname, '../client/dist');
app.use(express.static(clientDistPath));

// This handles all routes for React
app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(clientDistPath, 'index.html'));
});

// Server port
const PORT = process.env.PORT || 5000;

// MongoDB URI
const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error("❌ MONGO_URI is missing! Set it in Render Environment Variables or local .env file.");
  process.exit(1);
}

// Connect to MongoDB
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected successfully');

    // Start server after DB connection
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
    console.error(err);
  });

// Debug: check environment variables
console.log("🔹 Loaded Environment Variables:");
console.log({
  PORT: process.env.PORT,
  MONGO_URI: MONGO_URI ? "Loaded ✅" : "Missing ❌",
  JWT_SECRET: process.env.JWT_SECRET ? "Loaded ✅" : "Missing ❌",
  EMAIL_HOST: process.env.EMAIL_HOST || "Not Set",
  EMAIL_USER: process.env.EMAIL_USER || "Not Set",
});

