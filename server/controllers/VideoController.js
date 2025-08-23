// ভিডিও কন্ট্রোলার - MVC প্যাটার্ন অনুযায়ী
// Video Controller - Following MVC Pattern

const Video = require('../models/Video');
const ProcessingJob = require('../models/ProcessingJob');
const path = require('path');
const fs = require('fs-extra');

class VideoController {
    // সব ভিডিও পাওয়া হচ্ছে
    // Getting all videos
    static async getAllVideos(req, res) {
        try {
            const videos = await Video.findAll();

            res.json({
                success: true,
                count: videos.length,
                videos: videos.map(video => video.toJSON())
            });
        } catch (error) {
            console.error('❌ ভিডিও লিস্ট লোড করতে সমস্যা:', error);
            res.status(500).json({
                success: false,
                error: 'ভিডিও লিস্ট লোড করতে সমস্যা হয়েছে',
                message: error.message
            });
        }
    }

    // ID দিয়ে ভিডিও পাওয়া হচ্ছে
    // Getting video by ID
    static async getVideoById(req, res) {
        try {
            const { id } = req.params;
            const video = await Video.findById(id);

            if (!video) {
                return res.status(404).json({
                    success: false,
                    error: 'ভিডিও পাওয়া যায়নি',
                    message: 'অনুরোধকৃত ভিডিও পাওয়া যায়নি'
                });
            }

            res.json({
                success: true,
                video: video.toJSON()
            });
        } catch (error) {
            console.error('❌ ভিডিও লোড করতে সমস্যা:', error);
            res.status(500).json({
                success: false,
                error: 'ভিডিও লোড করতে সমস্যা হয়েছে',
                message: error.message
            });
        }
    }

    // নতুন ভিডিও তৈরি করা হচ্ছে
    // Creating new video
    static async createVideo(req, res) {
        try {
            if (!req.file) {
                return res.status(400).json({
                    success: false,
                    error: 'কোন ফাইল আপলোড করা হয়নি!',
                    message: 'দয়া করে একটি ভিডিও ফাইল নির্বাচন করুন'
                });
            }

            const videoData = {
                originalName: req.file.originalname,
                filename: req.file.filename,
                filePath: req.file.path,
                fileSize: req.file.size,
                mimeType: req.file.mimetype,
                status: 'uploaded'
            };

            const videoId = await Video.create(videoData);

            // আপলোডের পর automatically processing job তৈরি করছি
            // Creating processing job automatically after upload
            try {
                await ProcessingJob.create({
                    videoId: videoId,
                    jobType: 'metadata',
                    quality: null
                });
                console.log(`✅ ভিডিও ${videoId} এর জন্য metadata জব তৈরি হয়েছে`);
            } catch (processingError) {
                console.error(`⚠️ ভিডিও ${videoId} এর জন্য processing job তৈরি করতে সমস্যা:`, processingError);
                // Processing job error হলে ভিডিও আপলোড ব্যর্থ হবে না
                // If processing job fails, video upload won't fail
            }

            res.status(201).json({
                success: true,
                message: 'ভিডিও সফলভাবে আপলোড হয়েছে',
                videoId: videoId,
                video: {
                    id: videoId,
                    ...videoData
                }
            });
        } catch (error) {
            console.error('❌ ভিডিও আপলোড করতে সমস্যা:', error);
            res.status(500).json({
                success: false,
                error: 'ভিডিও আপলোড করতে সমস্যা হয়েছে',
                message: error.message
            });
        }
    }

    // ভিডিও আপডেট করা হচ্ছে
    // Updating video
    static async updateVideo(req, res) {
        try {
            const { id } = req.params;
            const updateData = req.body;

            const video = await Video.findById(id);
            if (!video) {
                return res.status(404).json({
                    success: false,
                    error: 'ভিডিও পাওয়া যায়নি',
                    message: 'অনুরোধকৃত ভিডিও পাওয়া যায়নি'
                });
            }

            const success = await video.update(updateData);

            if (success) {
                res.json({
                    success: true,
                    message: 'ভিডিও সফলভাবে আপডেট হয়েছে',
                    video: video.toJSON()
                });
            } else {
                res.status(400).json({
                    success: false,
                    error: 'ভিডিও আপডেট করতে সমস্যা হয়েছে',
                    message: 'কোন পরিবর্তন করা যায়নি'
                });
            }
        } catch (error) {
            console.error('❌ ভিডিও আপডেট করতে সমস্যা:', error);
            res.status(500).json({
                success: false,
                error: 'ভিডিও আপডেট করতে সমস্যা হয়েছে',
                message: error.message
            });
        }
    }

    // ভিডিও ডিলিট করা হচ্ছে
    // Deleting video
    static async deleteVideo(req, res) {
        try {
            const { id } = req.params;

            const video = await Video.findById(id);
            if (!video) {
                return res.status(404).json({
                    success: false,
                    error: 'ভিডিও পাওয়া যায়নি',
                    message: 'অনুরোধকৃত ভিডিও পাওয়া যায়নি'
                });
            }

            // ফাইল সিস্টেম থেকে ফাইল ডিলিট করা হচ্ছে
            // Deleting file from file system
            try {
                await fs.remove(video.filePath);

                // থাম্বনেইল ফাইল ডিলিট করা হচ্ছে
                // Deleting thumbnail file
                if (video.thumbnailPath && await fs.pathExists(video.thumbnailPath)) {
                    await fs.remove(video.thumbnailPath);
                }
            } catch (fileError) {
                console.warn('⚠️ ফাইল ডিলিট করতে সমস্যা:', fileError);
            }

            const success = await video.delete();

            if (success) {
                res.json({
                    success: true,
                    message: 'ভিডিও সফলভাবে ডিলিট হয়েছে'
                });
            } else {
                res.status(400).json({
                    success: false,
                    error: 'ভিডিও ডিলিট করতে সমস্যা হয়েছে',
                    message: 'কোন পরিবর্তন করা যায়নি'
                });
            }
        } catch (error) {
            console.error('❌ ভিডিও ডিলিট করতে সমস্যা:', error);
            res.status(500).json({
                success: false,
                error: 'ভিডিও ডিলিট করতে সমস্যা হয়েছে',
                message: error.message
            });
        }
    }

    // ভিডিও স্ট্যাটাস আপডেট করা হচ্ছে
    // Updating video status
    static async updateVideoStatus(req, res) {
        try {
            const { id } = req.params;
            const { status } = req.body;

            if (!status) {
                return res.status(400).json({
                    success: false,
                    error: 'স্ট্যাটাস প্রয়োজন',
                    message: 'স্ট্যাটাস ফিল্ড প্রয়োজন'
                });
            }

            const video = await Video.findById(id);
            if (!video) {
                return res.status(404).json({
                    success: false,
                    error: 'ভিডিও পাওয়া যায়নি',
                    message: 'অনুরোধকৃত ভিডিও পাওয়া যায়নি'
                });
            }

            const success = await video.updateStatus(status);

            if (success) {
                res.json({
                    success: true,
                    message: 'ভিডিও স্ট্যাটাস সফলভাবে আপডেট হয়েছে',
                    video: video.toJSON()
                });
            } else {
                res.status(400).json({
                    success: false,
                    error: 'স্ট্যাটাস আপডেট করতে সমস্যা হয়েছে',
                    message: 'কোন পরিবর্তন করা যায়নি'
                });
            }
        } catch (error) {
            console.error('❌ স্ট্যাটাস আপডেট করতে সমস্যা:', error);
            res.status(500).json({
                success: false,
                error: 'স্ট্যাটাস আপডেট করতে সমস্যা হয়েছে',
                message: error.message
            });
        }
    }

    // ভিডিও স্ট্যাটিসটিক্স পাওয়া হচ্ছে
    // Getting video statistics
    static async getVideoStats(req, res) {
        try {
            const stats = await Video.getStats();

            res.json({
                success: true,
                stats: stats
            });
        } catch (error) {
            console.error('❌ স্ট্যাটিসটিক্স লোড করতে সমস্যা:', error);
            res.status(500).json({
                success: false,
                error: 'স্ট্যাটিসটিক্স লোড করতে সমস্যা হয়েছে',
                message: error.message
            });
        }
    }

    // স্ট্যাটাস অনুযায়ী ভিডিও পাওয়া হচ্ছে
    // Getting videos by status
    static async getVideosByStatus(req, res) {
        try {
            const { status } = req.params;
            const videos = await Video.findByStatus(status);

            res.json({
                success: true,
                count: videos.length,
                status: status,
                videos: videos.map(video => video.toJSON())
            });
        } catch (error) {
            console.error('❌ স্ট্যাটাস অনুযায়ী ভিডিও লোড করতে সমস্যা:', error);
            res.status(500).json({
                success: false,
                error: 'স্ট্যাটাস অনুযায়ী ভিডিও লোড করতে সমস্যা হয়েছে',
                message: error.message
            });
        }
    }

    // সব ভিডিও এবং ডেটা ক্লিয়ার করা হচ্ছে
    // Clearing all videos and data
    static async clearAllVideos(req, res) {
        try {
            // সব ভিডিও পাওয়া হচ্ছে
            // Getting all videos
            const videos = await Video.findAll();

            // সব ভিডিও ফাইল ডিলিট করছি
            // Deleting all video files
            for (const video of videos) {
                try {
                    if (await fs.pathExists(video.filePath)) {
                        await fs.remove(video.filePath);
                    }

                    // থাম্বনেইল ডিলিট করছি
                    // Deleting thumbnail
                    if (video.thumbnailPath && await fs.pathExists(video.thumbnailPath)) {
                        await fs.remove(video.thumbnailPath);
                    }
                } catch (fileError) {
                    console.error(`ফাইল ডিলিটে সমস্যা: ${video.filePath}`, fileError);
                    // ফাইল ডিলিটে সমস্যা হলেও continue করছি
                    // Continue even if file deletion fails
                }
            }

            // আপলোড এবং temp ফোল্ডার ক্লিন করছি
            // Cleaning upload and temp folders
            try {
                const uploadPath = process.env.UPLOAD_PATH || './uploads';
                const tempPath = process.env.TEMP_PATH || './temp';

                if (await fs.pathExists(uploadPath)) {
                    await fs.emptyDir(uploadPath);
                    console.log('✅ আপলোড ফোল্ডার ক্লিন হয়েছে');
                }

                if (await fs.pathExists(tempPath)) {
                    await fs.emptyDir(tempPath);
                    console.log('✅ টেম্প ফোল্ডার ক্লিন হয়েছে');
                }
            } catch (folderError) {
                console.error('ফোল্ডার ক্লিনআপে সমস্যা:', folderError);
            }

            // ডাটাবেস ক্লিয়ার করছি
            // Clearing database
            const dbConnection = require('../database/connection');

            // সব টেবিল ক্লিয়ার করছি
            // Clearing all tables
            await dbConnection.run('DELETE FROM processing_jobs');
            await dbConnection.run('DELETE FROM video_conversions');
            await dbConnection.run('DELETE FROM video_views');
            await dbConnection.run('DELETE FROM videos');

            // AUTO_INCREMENT reset করছি
            // Resetting AUTO_INCREMENT
            await dbConnection.run("DELETE FROM sqlite_sequence WHERE name='videos'");
            await dbConnection.run("DELETE FROM sqlite_sequence WHERE name='processing_jobs'");
            await dbConnection.run("DELETE FROM sqlite_sequence WHERE name='video_conversions'");
            await dbConnection.run("DELETE FROM sqlite_sequence WHERE name='video_views'");

            console.log('✅ ডাটাবেস ক্লিয়ার হয়েছে');

            res.json({
                success: true,
                message: 'সব ভিডিও এবং ডেটা সফলভাবে ক্লিয়ার হয়েছে',
                deletedVideos: videos.length
            });

        } catch (error) {
            console.error('❌ সব ডেটা ক্লিয়ার করতে সমস্যা:', error);
            res.status(500).json({
                success: false,
                error: 'সব ডেটা ক্লিয়ার করতে সমস্যা হয়েছে',
                message: error.message
            });
        }
    }
}

module.exports = VideoController;
