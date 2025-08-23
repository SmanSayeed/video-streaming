// ভিডিও সম্পর্কিত API রাউটগুলি - MVC প্যাটার্ন অনুযায়ী
// API routes for videos - Following MVC Pattern

const express = require('express');
const router = express.Router();

// ভিডিও কন্ট্রোলার ইমপোর্ট করা হচ্ছে
// Importing video controller
const VideoController = require('../controllers/VideoController');

// সব ভিডিও পাওয়ার জন্য
// Get all videos
router.get('/', VideoController.getAllVideos);

// নির্দিষ্ট ভিডিওর বিবরণ পাওয়ার জন্য
// Get specific video details
router.get('/:id', VideoController.getVideoById);

// ভিডিও আপডেট করার জন্য
// Update video
router.put('/:id', VideoController.updateVideo);

// ভিডিও ডিলিট করার জন্য
// Delete video
router.delete('/:id', VideoController.deleteVideo);

// ভিডিও স্ট্যাটাস আপডেট করার জন্য
// Update video status
router.patch('/:id/status', VideoController.updateVideoStatus);

// ভিডিও স্ট্যাটিসটিক্স পাওয়ার জন্য
// Get video statistics
router.get('/stats/overview', VideoController.getVideoStats);

// স্ট্যাটাস অনুযায়ী ভিডিও পাওয়ার জন্য
// Get videos by status
router.get('/status/:status', VideoController.getVideosByStatus);

// সব ভিডিও এবং ডেটা ক্লিয়ার করার জন্য
// Clear all videos and data
router.delete('/clear-all', VideoController.clearAllVideos);

module.exports = router;
