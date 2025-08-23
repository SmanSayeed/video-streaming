// ভিডিও স্ট্রিমিং এর জন্য রাউট
// Route for video streaming

// Express Router ইমপোর্ট করা হচ্ছে
// Importing Express Router
const express = require('express');
const router = express.Router();

// fs-extra এবং path ইমপোর্ট করা হচ্ছে
// Importing fs-extra and path
const fs = require('fs-extra');
const path = require('path');

// ভিডিও স্ট্রিমিং এর জন্য GET রাউট
// GET route for video streaming
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { range } = req.headers;

    // Database থেকে video info নিচ্ছি
    // Getting video info from database
    const Video = require('../models/Video');
    const video = await Video.findById(id);

    if (!video) {
      return res.status(404).json({
        error: 'ভিডিও পাওয়া যায়নি',
        message: 'অনুরোধকৃত ভিডিও খুঁজে পাওয়া যায়নি'
      });
    }

    // Video file path check করছি
    // Checking video file path
    const videoPath = video.filePath;

    if (!await fs.pathExists(videoPath)) {
      return res.status(404).json({
        error: 'ভিডিও ফাইল পাওয়া যায়নি',
        message: 'ভিডিও ফাইল সিস্টেমে নেই'
      });
    }

    // ফাইল স্ট্যাটস চেক করছি
    // Checking file stats
    const stat = await fs.stat(videoPath);
    const fileSize = stat.size;

    // Range হেডার আছে কিনা চেক করছি (ভিডিও স্ট্রিমিং এর জন্য)
    // Checking if range header exists (for video streaming)
    if (range) {
      // Range পার্স করছি (যেমন: bytes=0-1023)
      // Parsing range (e.g., bytes=0-1023)
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

      // চাঙ্ক সাইজ ক্যালকুলেট করছি
      // Calculating chunk size
      const chunksize = (end - start) + 1;

      // ভিডিও ফাইল স্ট্রিম করছি
      // Streaming video file
      const file = fs.createReadStream(videoPath, { start, end });

      // HTTP হেডার সেট করছি
      // Setting HTTP headers
      res.writeHead(206, {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': 'video/mp4',
        'Cache-Control': 'no-cache'
      });

      // ফাইল স্ট্রিম রেসপন্সে পাঠাচ্ছি
      // Piping file stream to response
      file.pipe(res);

    } else {
      // Range হেডার না থাকলে পুরো ফাইল পাঠাচ্ছি
      // If no range header, sending entire file
      res.writeHead(200, {
        'Content-Length': fileSize,
        'Content-Type': 'video/mp4',
        'Accept-Ranges': 'bytes'
      });

      // পুরো ফাইল স্ট্রিম করছি
      // Streaming entire file
      const file = fs.createReadStream(videoPath);
      file.pipe(res);
    }

  } catch (error) {
    console.error('ভিডিও স্ট্রিমিং এ এরর:', error);

    // এরর রেসপন্স পাঠাচ্ছি
    // Sending error response
    res.status(500).json({
      error: 'ভিডিও স্ট্রিম করতে সমস্যা হয়েছে',
      message: error.message
    });
  }
});

// ভিডিও থাম্বনেইল পাওয়ার জন্য GET রাউট
// GET route for getting video thumbnail
router.get('/:id/thumbnail', async (req, res) => {
  try {
    const { id } = req.params;

    // আপলোড ফোল্ডার থেকে ভিডিও খুঁজছি
    // Finding video from upload folder
    const uploadPath = process.env.UPLOAD_PATH || './uploads';
    const files = await fs.readdir(uploadPath);

    // ভিডিও ফাইল খুঁজছি
    // Finding video file
    const videoFile = files.find(file => {
      const fileId = path.basename(file, path.extname(file));
      return fileId === id;
    });

    if (!videoFile) {
      return res.status(404).json({
        error: 'ভিডিও পাওয়া যায়নি',
        message: 'অনুরোধকৃত ভিডিও খুঁজে পাওয়া যায়নি'
      });
    }

    // থাম্বনেইল পাথ তৈরি করছি
    // Creating thumbnail path
    const thumbnailPath = path.join(uploadPath, 'thumbnails', `${id}.jpg`);

    // থাম্বনেইল আছে কিনা চেক করছি
    // Checking if thumbnail exists
    if (await fs.pathExists(thumbnailPath)) {
      // থাম্বনেইল পাঠাচ্ছি
      // Sending thumbnail
      res.sendFile(thumbnailPath);
    } else {
      // থাম্বনেইল না থাকলে placeholder পাঠাচ্ছি
      // If no thumbnail, sending placeholder
      res.status(404).json({
        error: 'থাম্বনেইল পাওয়া যায়নি',
        message: 'ভিডিওর থাম্বনেইল এখনো তৈরি করা হয়নি'
      });
    }

  } catch (error) {
    console.error('থাম্বনেইল লোডে এরর:', error);

    res.status(500).json({
      error: 'থাম্বনেইল লোড করতে সমস্যা হয়েছে',
      message: error.message
    });
  }
});

module.exports = router;
