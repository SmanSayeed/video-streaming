// ভিডিও স্ট্রিমিং অ্যাপ্লিকেশনের মূল সার্ভার ফাইল
// Main server file for video streaming application

// প্রয়োজনীয় মডিউলগুলি ইমপোর্ট করা হচ্ছে
// Importing required modules
const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// ডাটাবেস কানেকশন ইমপোর্ট করা হচ্ছে
// Importing database connection
const dbConnection = require('./database/connection');

// Express অ্যাপ্লিকেশন তৈরি করা হচ্ছে
// Creating Express application
const app = express();

// সার্ভার কনফিগারেশন
// Server configuration
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// মিডলওয়্যার সেটআপ
// Middleware setup
app.use(cors({
    origin: [
        'http://localhost:3000',
        // 'https://your-vercel-app.vercel.app',
        // 'https://your-custom-domain.com'
    ],
    credentials: true
}));

// JSON এবং URL-encoded ডেটা পার্স করার জন্য মিডলওয়্যার
// Middleware for parsing JSON and URL-encoded data
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: true, limit: '100mb' }));

// স্ট্যাটিক ফাইল সার্ভ করার জন্য
// For serving static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// বেসিক রাউট
// Basic route
app.get('/', (req, res) => {
    res.json({
        message: 'ভিডিও স্ট্রিমিং API সার্ভার চলছে',
        status: 'running',
        environment: NODE_ENV
    });
});

// API রাউটগুলি এখানে যোগ করা হবে
// API routes will be added here
app.use('/api/upload', require('./routes/upload'));
app.use('/api/videos', require('./routes/videos'));
app.use('/api/stream', require('./routes/stream'));
app.use('/api/processing', require('./routes/processing'));

// এরর হ্যান্ডলিং মিডলওয়্যার
// Error handling middleware
app.use((err, req, res, next) => {
    console.error('সার্ভার এরর:', err.stack);
    res.status(500).json({
        error: 'সার্ভারে একটি সমস্যা হয়েছে',
        message: err.message
    });
});

// 404 হ্যান্ডলিং
// 404 handling
app.use('*', (req, res) => {
    res.status(404).json({
        error: 'রাউট পাওয়া যায়নি',
        message: 'অনুরোধকৃত পেজ পাওয়া যায়নি'
    });
});

// সার্ভার শুরু করা
// Starting the server
const startServer = async () => {
    try {
        // ডাটাবেস কানেকশন তৈরি করা হচ্ছে
        // Creating database connection
        await dbConnection.connect();
        console.log('✅ ডাটাবেস কানেকশন সফল');

        // সার্ভার লিসেন করা হচ্ছে
        // Server listening
        app.listen(PORT, () => {
            console.log(`🚀 সার্ভার ${PORT} পোর্টে চলছে`);
            console.log(`🌍 পরিবেশ: ${NODE_ENV}`);
            console.log(`📹 ভিডিও স্ট্রিমিং অ্যাপ্লিকেশন প্রস্তুত`);
            console.log(`🗄️ SQLite ডাটাবেস প্রস্তুত`);
        });
    } catch (error) {
        console.error('❌ সার্ভার শুরু করতে সমস্যা:', error);
        process.exit(1);
    }
};

startServer();

module.exports = app;
