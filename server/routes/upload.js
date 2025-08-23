// ভিডিও আপলোড করার জন্য রাউট - MVC প্যাটার্ন অনুযায়ী
// Route for video uploads - Following MVC Pattern

const express = require('express');
const router = express.Router();

// আপলোড মিডলওয়্যার ইমপোর্ট করা হচ্ছে
// Importing upload middleware
const { uploadMiddleware } = require('../middleware/upload');

// ভিডিও কন্ট্রোলার ইমপোর্ট করা হচ্ছে
// Importing video controller
const VideoController = require('../controllers/VideoController');

// ভিডিও আপলোড করার জন্য POST রাউট
// POST route for video uploads
router.post('/', uploadMiddleware, VideoController.createVideo);

// আপলোড স্ট্যাটাস চেক করার জন্য GET রাউট
// GET route for checking upload status
router.get('/status/:id', (req, res) => {
    try {
        const { id } = req.params;

        // এখানে ডাটাবেস থেকে আপলোড স্ট্যাটাস চেক করব
        // Here we'll check upload status from database
        // এখন শুধু placeholder রেসপন্স পাঠাচ্ছি
        // Now just sending placeholder response

        res.json({
            id: id,
            status: 'processing',
            message: 'ভিডিও প্রসেস হচ্ছে...'
        });

    } catch (error) {
        console.error('স্ট্যাটাস চেকে এরর:', error);
        res.status(500).json({
            error: 'স্ট্যাটাস চেক করতে সমস্যা হয়েছে',
            message: error.message
        });
    }
});

module.exports = router;
