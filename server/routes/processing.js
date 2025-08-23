// প্রসেসিং রাউট - ভিডিও প্রসেসিং সম্পর্কিত API endpoints
// Processing Routes - API endpoints for video processing

const express = require('express');
const router = express.Router();

// প্রসেসিং কন্ট্রোলার ইমপোর্ট করা হচ্ছে
// Importing processing controller
const ProcessingController = require('../controllers/ProcessingController');

// সব প্রসেসিং জব পাওয়ার জন্য
// Get all processing jobs
router.get('/jobs', ProcessingController.getAllJobs);

// নির্দিষ্ট প্রসেসিং জব পাওয়ার জন্য
// Get specific processing job
router.get('/jobs/:id', ProcessingController.getJobById);

// ভিডিও ID দিয়ে প্রসেসিং জব পাওয়ার জন্য
// Get processing jobs by video ID
router.get('/videos/:videoId/jobs', ProcessingController.getJobsByVideoId);

// স্ট্যাটাস অনুযায়ী প্রসেসিং জব পাওয়ার জন্য (string status)
// Get processing jobs by status (string status)
router.get('/status/by/:status', ProcessingController.getJobsByStatus);

// জব স্ট্যাটাস চেক করার জন্য (ID দিয়ে)
// Check job status (by ID)
router.get('/status/:id', ProcessingController.getJobById);

// নতুন প্রসেসিং জব তৈরি করার জন্য
// Create new processing job
router.post('/jobs', ProcessingController.createJob);

// প্রসেসিং জব আপডেট করার জন্য
// Update processing job
router.put('/jobs/:id', ProcessingController.updateJob);

// প্রসেসিং জব স্ট্যাটাস আপডেট করার জন্য
// Update processing job status
router.patch('/jobs/:id/status', ProcessingController.updateJobStatus);

// প্রসেসিং জব প্রগ্রেস আপডেট করার জন্য
// Update processing job progress
router.patch('/jobs/:id/progress', ProcessingController.updateJobProgress);

// প্রসেসিং জব ডিলিট করার জন্য
// Delete processing job
router.delete('/jobs/:id', ProcessingController.deleteJob);

// প্রসেসিং জব স্ট্যাটিসটিক্স পাওয়ার জন্য
// Get processing job statistics
router.get('/stats', ProcessingController.getJobStats);

// ভিডিও কনভার্শন শুরু করার জন্য
// Start video conversion
router.post('/convert/:id', ProcessingController.startConversion);

// প্রসেসিং জব ক্লিনআপ করার জন্য
// Cleanup processing jobs
router.delete('/cleanup', ProcessingController.cleanupJobs);

module.exports = router;
