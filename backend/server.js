require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('../routes/auth.routes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Root route
app.get('/', (req, res) => {
    res.send('Server is running!');
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

// Server port
const PORT = process.env.PORT || 5000;

// MongoDB URI
const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://video_25:Video_2025@cluster0.l8c6jfa.mongodb.net/videoInterviewDB?retryWrites=true&w=majority&appName=Cluster0";

// Connect to MongoDB
mongoose.connect(MONGO_URI)
    .then(() => {
        console.log('✅ MongoDB connected successfully');

        // Start server after DB connection
        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
        });
    })
    .catch(err => {
        console.error('❌ MongoDB connection error:', err.message);
        console.error(err);
    });
