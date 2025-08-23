// প্রসেসিং কন্ট্রোলার - ভিডিও প্রসেসিং সম্পর্কিত API requests হ্যান্ডল করার জন্য
// ProcessingController - For handling video processing related API requests

const ProcessingJob = require('../models/ProcessingJob');
const Video = require('../models/Video');

class ProcessingController {
    // সব প্রসেসিং জব পাওয়ার জন্য
    // Get all processing jobs
    static async getAllJobs(req, res) {
        try {
            const jobs = await ProcessingJob.findAll();

            res.json({
                success: true,
                count: jobs.length,
                jobs: jobs.map(job => job.toJSON())
            });
        } catch (error) {
            console.error('প্রসেসিং জব লোডে এরর:', error);
            res.status(500).json({
                success: false,
                error: 'প্রসেসিং জব লোড করতে সমস্যা হয়েছে',
                message: error.message
            });
        }
    }

    // নির্দিষ্ট প্রসেসিং জব পাওয়ার জন্য
    // Get specific processing job
    static async getJobById(req, res) {
        try {
            const { id } = req.params;
            const job = await ProcessingJob.findById(id);

            if (!job) {
                return res.status(404).json({
                    success: false,
                    error: 'প্রসেসিং জব পাওয়া যায়নি',
                    message: 'অনুরোধকৃত প্রসেসিং জব খুঁজে পাওয়া যায়নি'
                });
            }

            res.json({
                success: true,
                job: job.toJSON()
            });
        } catch (error) {
            console.error('প্রসেসিং জব লোডে এরর:', error);
            res.status(500).json({
                success: false,
                error: 'প্রসেসিং জব লোড করতে সমস্যা হয়েছে',
                message: error.message
            });
        }
    }

    // ভিডিও ID দিয়ে প্রসেসিং জব পাওয়ার জন্য
    // Get processing jobs by video ID
    static async getJobsByVideoId(req, res) {
        try {
            const { videoId } = req.params;

            // ভিডিও আছে কিনা চেক করছি
            // Checking if video exists
            const video = await Video.findById(videoId);
            if (!video) {
                return res.status(404).json({
                    success: false,
                    error: 'ভিডিও পাওয়া যায়নি',
                    message: 'অনুরোধকৃত ভিডিও খুঁজে পাওয়া যায়নি'
                });
            }

            const jobs = await ProcessingJob.findByVideoId(videoId);

            res.json({
                success: true,
                videoId: parseInt(videoId),
                count: jobs.length,
                jobs: jobs.map(job => job.toJSON())
            });
        } catch (error) {
            console.error('ভিডিও জব লোডে এরর:', error);
            res.status(500).json({
                success: false,
                error: 'ভিডিও জব লোড করতে সমস্যা হয়েছে',
                message: error.message
            });
        }
    }

    // স্ট্যাটাস অনুযায়ী প্রসেসিং জব পাওয়ার জন্য
    // Get processing jobs by status
    static async getJobsByStatus(req, res) {
        try {
            const { status } = req.params;

            // স্ট্যাটাস ভ্যালিড কিনা চেক করছি
            // Checking if status is valid
            const validStatuses = ['queued', 'processing', 'completed', 'failed', 'cancelled'];
            if (!validStatuses.includes(status)) {
                return res.status(400).json({
                    success: false,
                    error: 'অবৈধ স্ট্যাটাস',
                    message: 'অনুরোধকৃত স্ট্যাটাস বৈধ নয়'
                });
            }

            const jobs = await ProcessingJob.findByStatus(status);

            res.json({
                success: true,
                status: status,
                count: jobs.length,
                jobs: jobs.map(job => job.toJSON())
            });
        } catch (error) {
            console.error('স্ট্যাটাস অনুযায়ী জব লোডে এরর:', error);
            res.status(500).json({
                success: false,
                error: 'স্ট্যাটাস অনুযায়ী জব লোড করতে সমস্যা হয়েছে',
                message: error.message
            });
        }
    }

    // নতুন প্রসেসিং জব তৈরি করার জন্য
    // Create new processing job
    static async createJob(req, res) {
        try {
            const { videoId, jobType, quality } = req.body;

            // প্রয়োজনীয় ফিল্ডগুলি চেক করছি
            // Checking required fields
            if (!videoId || !jobType) {
                return res.status(400).json({
                    success: false,
                    error: 'অপূর্ণ তথ্য',
                    message: 'videoId এবং jobType প্রয়োজন'
                });
            }

            // ভিডিও আছে কিনা চেক করছি
            // Checking if video exists
            const video = await Video.findById(videoId);
            if (!video) {
                return res.status(404).json({
                    success: false,
                    error: 'ভিডিও পাওয়া যায়নি',
                    message: 'অনুরোধকৃত ভিডিও খুঁজে পাওয়া যায়নি'
                });
            }

            // জব টাইপ ভ্যালিড কিনা চেক করছি
            // Checking if job type is valid
            const validJobTypes = ['thumbnail', 'convert', 'metadata', 'compress'];
            if (!validJobTypes.includes(jobType)) {
                return res.status(400).json({
                    success: false,
                    error: 'অবৈধ জব টাইপ',
                    message: 'অনুরোধকৃত জব টাইপ বৈধ নয়'
                });
            }

            // নতুন জব তৈরি করছি
            // Creating new job
            const job = await ProcessingJob.create({
                videoId: parseInt(videoId),
                jobType,
                quality
            });

            res.status(201).json({
                success: true,
                message: 'প্রসেসিং জব সফলভাবে তৈরি হয়েছে',
                job: job.toJSON()
            });
        } catch (error) {
            console.error('প্রসেসিং জব তৈরি করতে সমস্যা:', error);
            res.status(500).json({
                success: false,
                error: 'প্রসেসিং জব তৈরি করতে সমস্যা হয়েছে',
                message: error.message
            });
        }
    }

    // প্রসেসিং জব আপডেট করার জন্য
    // Update processing job
    static async updateJob(req, res) {
        try {
            const { id } = req.params;
            const updateData = req.body;

            const job = await ProcessingJob.findById(id);
            if (!job) {
                return res.status(404).json({
                    success: false,
                    error: 'প্রসেসিং জব পাওয়া যায়নি',
                    message: 'অনুরোধকৃত প্রসেসিং জব খুঁজে পাওয়া যায়নি'
                });
            }

            // জব আপডেট করছি
            // Updating job
            await job.update(updateData);

            res.json({
                success: true,
                message: 'প্রসেসিং জব সফলভাবে আপডেট হয়েছে',
                job: job.toJSON()
            });
        } catch (error) {
            console.error('প্রসেসিং জব আপডেট করতে সমস্যা:', error);
            res.status(500).json({
                success: false,
                error: 'প্রসেসিং জব আপডেট করতে সমস্যা হয়েছে',
                message: error.message
            });
        }
    }

    // প্রসেসিং জব স্ট্যাটাস আপডেট করার জন্য
    // Update processing job status
    static async updateJobStatus(req, res) {
        try {
            const { id } = req.params;
            const { status, message } = req.body;

            if (!status) {
                return res.status(400).json({
                    success: false,
                    error: 'অপূর্ণ তথ্য',
                    message: 'status প্রয়োজন'
                });
            }

            const job = await ProcessingJob.findById(id);
            if (!job) {
                return res.status(404).json({
                    success: false,
                    error: 'প্রসেসিং জব পাওয়া যায়নি',
                    message: 'অনুরোধকৃত প্রসেসিং জব খুঁজে পাওয়া যায়নি'
                });
            }

            // স্ট্যাটাস আপডেট করছি
            // Updating status
            await job.updateStatus(status, message);

            res.json({
                success: true,
                message: 'প্রসেসিং জব স্ট্যাটাস সফলভাবে আপডেট হয়েছে',
                job: job.toJSON()
            });
        } catch (error) {
            console.error('প্রসেসিং জব স্ট্যাটাস আপডেট করতে সমস্যা:', error);
            res.status(500).json({
                success: false,
                error: 'প্রসেসিং জব স্ট্যাটাস আপডেট করতে সমস্যা হয়েছে',
                message: error.message
            });
        }
    }

    // প্রসেসিং জব প্রগ্রেস আপডেট করার জন্য
    // Update processing job progress
    static async updateJobProgress(req, res) {
        try {
            const { id } = req.params;
            const { progress, message } = req.body;

            if (progress === undefined || progress < 0 || progress > 100) {
                return res.status(400).json({
                    success: false,
                    error: 'অবৈধ প্রগ্রেস',
                    message: 'প্রগ্রেস 0-100 এর মধ্যে হতে হবে'
                });
            }

            const job = await ProcessingJob.findById(id);
            if (!job) {
                return res.status(404).json({
                    success: false,
                    error: 'প্রসেসিং জব পাওয়া যায়নি',
                    message: 'অনুরোধকৃত প্রসেসিং জব খুঁজে পাওয়া যায়নি'
                });
            }

            // প্রগ্রেস আপডেট করছি
            // Updating progress
            await job.updateProgress(progress, message);

            res.json({
                success: true,
                message: 'প্রসেসিং জব প্রগ্রেস সফলভাবে আপডেট হয়েছে',
                job: job.toJSON()
            });
        } catch (error) {
            console.error('প্রসেসিং জব প্রগ্রেস আপডেট করতে সমস্যা:', error);
            res.status(500).json({
                success: false,
                error: 'প্রসেসিং জব প্রগ্রেস আপডেট করতে সমস্যা হয়েছে',
                message: error.message
            });
        }
    }

    // প্রসেসিং জব ডিলিট করার জন্য
    // Delete processing job
    static async deleteJob(req, res) {
        try {
            const { id } = req.params;

            const job = await ProcessingJob.findById(id);
            if (!job) {
                return res.status(404).json({
                    success: false,
                    error: 'প্রসেসিং জব পাওয়া যায়নি',
                    message: 'অনুরোধকৃত প্রসেসিং জব খুঁজে পাওয়া যায়নি'
                });
            }

            // জব ডিলিট করছি
            // Deleting job
            await job.delete();

            res.json({
                success: true,
                message: 'প্রসেসিং জব সফলভাবে ডিলিট হয়েছে'
            });
        } catch (error) {
            console.error('প্রসেসিং জব ডিলিট করতে সমস্যা:', error);
            res.status(500).json({
                success: false,
                error: 'প্রসেসিং জব ডিলিট করতে সমস্যা হয়েছে',
                message: error.message
            });
        }
    }

    // প্রসেসিং জব স্ট্যাটিসটিক্স পাওয়ার জন্য
    // Get processing job statistics
    static async getJobStats(req, res) {
        try {
            const stats = await ProcessingJob.getStats();

            res.json({
                success: true,
                stats: stats
            });
        } catch (error) {
            console.error('প্রসেসিং জব স্ট্যাটিসটিক্স লোডে এরর:', error);
            res.status(500).json({
                success: false,
                error: 'প্রসেসিং জব স্ট্যাটিসটিক্স লোড করতে সমস্যা হয়েছে',
                message: error.message
            });
        }
    }

    // ভিডিও কনভার্শন শুরু করার জন্য
    // Start video conversion
    static async startConversion(req, res) {
        try {
            const { id } = req.params;
            const { quality = '720p' } = req.body;

            // ভিডিও খুঁজছি
            // Finding video
            const Video = require('../models/Video');
            const video = await Video.findById(id);

            if (!video) {
                return res.status(404).json({
                    success: false,
                    error: 'ভিডিও পাওয়া যায়নি',
                    message: 'অনুরোধকৃত ভিডিও পাওয়া যায়নি'
                });
            }

            // নতুন কনভার্শন জব তৈরি করছি
            // Creating new conversion job
            const job = await ProcessingJob.create({
                videoId: id,
                jobType: 'conversion',
                quality: quality
            });

            if (!job) {
                throw new Error('প্রসেসিং জব তৈরি করতে সমস্যা হয়েছে');
            }

            // জব স্ট্যাটাস আপডেট করছি
            // Updating job status
            await job.update({
                status: 'processing',
                message: `${quality} কোয়ালিটিতে কনভার্শন শুরু হয়েছে`
            });

            // ভিডিও স্ট্যাটাস আপডেট করছি
            // Updating video status
            await video.updateStatus('processing');

            console.log(`✅ ভিডিও ${id} এর জন্য ${quality} কনভার্শন শুরু হয়েছে`);

            res.json({
                success: true,
                message: 'কনভার্শন শুরু হয়েছে',
                jobId: job.id,
                videoId: id,
                quality: quality
            });

        } catch (error) {
            console.error('❌ ভিডিও কনভার্শন শুরু করতে সমস্যা:', error);
            res.status(500).json({
                success: false,
                error: 'কনভার্শন শুরু করতে সমস্যা হয়েছে',
                message: error.message
            });
        }
    }

    // প্রসেসিং জব ক্লিনআপ করার জন্য
    // Cleanup processing jobs
    static async cleanupJobs(req, res) {
        try {
            const { daysOld = 30 } = req.query;
            const deletedCount = await ProcessingJob.cleanupOldJobs(parseInt(daysOld));

            res.json({
                success: true,
                message: `${deletedCount} টি পুরানো জব ক্লিনআপ হয়েছে`,
                deletedCount: deletedCount
            });
        } catch (error) {
            console.error('প্রসেসিং জব ক্লিনআপ করতে সমস্যা:', error);
            res.status(500).json({
                success: false,
                error: 'প্রসেসিং জব ক্লিনআপ করতে সমস্যা হয়েছে',
                message: error.message
            });
        }
    }
}

module.exports = ProcessingController;
