// প্রসেসিং জব মডেল - ভিডিও প্রসেসিং জবগুলি ম্যানেজ করার জন্য
// ProcessingJob Model - For managing video processing jobs

const dbConnection = require('../database/connection');

class ProcessingJob {
    constructor(data) {
        this.id = data.id;
        this.videoId = data.video_id;
        this.jobType = data.job_type;
        this.quality = data.quality;
        this.status = data.status;
        this.progress = data.progress;
        this.message = data.message;
        this.startTime = data.start_time;
        this.endTime = data.end_time;
        this.createdAt = data.created_at;
        this.updatedAt = data.updated_at;
    }

    // সব প্রসেসিং জব পাওয়ার জন্য
    // Get all processing jobs
    static async findAll() {
        try {
            const jobs = await dbConnection.query(`
                SELECT * FROM processing_jobs 
                ORDER BY created_at DESC
            `);

            return jobs.map(job => new ProcessingJob(job));
        } catch (error) {
            console.error('প্রসেসিং জব লোড করতে সমস্যা:', error);
            throw new Error('প্রসেসিং জব লোড করতে সমস্যা হয়েছে');
        }
    }

    // ID দিয়ে প্রসেসিং জব পাওয়ার জন্য
    // Get processing job by ID
    static async findById(id) {
        try {
            const job = await dbConnection.get(`
                SELECT * FROM processing_jobs 
                WHERE id = ?
            `, [id]);

            return job ? new ProcessingJob(job) : null;
        } catch (error) {
            console.error('প্রসেসিং জব খুঁজতে সমস্যা:', error);
            throw new Error('প্রসেসিং জব খুঁজতে সমস্যা হয়েছে');
        }
    }

    // ভিডিও ID দিয়ে প্রসেসিং জব পাওয়ার জন্য
    // Get processing jobs by video ID
    static async findByVideoId(videoId) {
        try {
            const jobs = await dbConnection.query(`
                SELECT * FROM processing_jobs 
                WHERE video_id = ?
                ORDER BY created_at DESC
            `, [videoId]);

            return jobs.map(job => new ProcessingJob(job));
        } catch (error) {
            console.error('ভিডিও জব লোড করতে সমস্যা:', error);
            throw new Error('ভিডিও জব লোড করতে সমস্যা হয়েছে');
        }
    }

    // স্ট্যাটাস অনুযায়ী প্রসেসিং জব পাওয়ার জন্য
    // Get processing jobs by status
    static async findByStatus(status) {
        try {
            const jobs = await dbConnection.query(`
                SELECT * FROM processing_jobs 
                WHERE status = ?
                ORDER BY created_at DESC
            `, [status]);

            return jobs.map(job => new ProcessingJob(job));
        } catch (error) {
            console.error('স্ট্যাটাস অনুযায়ী জব লোড করতে সমস্যা:', error);
            throw new Error('স্ট্যাটাস অনুযায়ী জব লোড করতে সমস্যা হয়েছে');
        }
    }

    // নতুন প্রসেসিং জব তৈরি করার জন্য
    // Create new processing job
    static async create(jobData) {
        try {
            const { videoId, jobType, quality } = jobData;

            const result = await dbConnection.run(`
                INSERT INTO processing_jobs (
                    video_id, job_type, quality, status, progress, 
                    message, start_time, created_at, updated_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
            `, [videoId, jobType, quality, 'queued', 0, 'জব কুয়েতে যোগ হয়েছে', null]);

            const jobId = result.lastID;
            return await ProcessingJob.findById(jobId);
        } catch (error) {
            console.error('প্রসেসিং জব তৈরি করতে সমস্যা:', error);
            throw new Error('প্রসেসিং জব তৈরি করতে সমস্যা হয়েছে');
        }
    }

    // প্রসেসিং জব আপডেট করার জন্য
    // Update processing job
    async update(updateData) {
        try {
            const { status, progress, message, endTime } = updateData;

            const updateFields = [];
            const updateValues = [];

            if (status !== undefined) {
                updateFields.push('status = ?');
                updateValues.push(status);
            }

            if (progress !== undefined) {
                updateFields.push('progress = ?');
                updateValues.push(progress);
            }

            if (message !== undefined) {
                updateFields.push('message = ?');
                updateValues.push(message);
            }

            if (endTime !== undefined) {
                updateFields.push('end_time = ?');
                updateValues.push(endTime);
            }

            updateFields.push('updated_at = datetime(\'now\')');
            updateValues.push(this.id);

            await dbConnection.run(`
                UPDATE processing_jobs 
                SET ${updateFields.join(', ')}
                WHERE id = ?
            `, updateValues);

            // আপডেটেড ডেটা রিফ্রেশ করছি
            // Refreshing updated data
            const updatedJob = await ProcessingJob.findById(this.id);
            Object.assign(this, updatedJob);

            return this;
        } catch (error) {
            console.error('প্রসেসিং জব আপডেট করতে সমস্যা:', error);
            throw new Error('প্রসেসিং জব আপডেট করতে সমস্যা হয়েছে');
        }
    }

    // প্রসেসিং জব ডিলিট করার জন্য
    // Delete processing job
    async delete() {
        try {
            await dbConnection.run(`
                DELETE FROM processing_jobs 
                WHERE id = ?
            `, [this.id]);

            return true;
        } catch (error) {
            console.error('প্রসেসিং জব ডিলিট করতে সমস্যা:', error);
            throw new Error('প্রসেসিং জব ডিলিট করতে সমস্যা হয়েছে');
        }
    }

    // প্রসেসিং জব স্ট্যাটাস আপডেট করার জন্য
    // Update processing job status
    async updateStatus(status, message = null) {
        const updateData = { status };
        if (message) {
            updateData.message = message;
        }

        if (status === 'completed' || status === 'failed' || status === 'cancelled') {
            updateData.endTime = new Date().toISOString();
        }

        return await this.update(updateData);
    }

    // প্রসেসিং জব প্রগ্রেস আপডেট করার জন্য
    // Update processing job progress
    async updateProgress(progress, message = null) {
        const updateData = { progress };
        if (message) {
            updateData.message = message;
        }

        return await this.update(updateData);
    }

    // প্রসেসিং জব স্ট্যাটিসটিক্স পাওয়ার জন্য
    // Get processing job statistics
    static async getStats() {
        try {
            const stats = await dbConnection.get(`
                SELECT 
                    COUNT(*) as total,
                    COUNT(CASE WHEN status = 'queued' THEN 1 END) as queued_count,
                    COUNT(CASE WHEN status = 'processing' THEN 1 END) as processing_count,
                    COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_count,
                    COUNT(CASE WHEN status = 'failed' THEN 1 END) as failed_count,
                    COUNT(CASE WHEN status = 'cancelled' THEN 1 END) as cancelled_count,
                    AVG(CASE WHEN status = 'completed' THEN progress END) as avg_progress
                FROM processing_jobs
            `);

            return stats;
        } catch (error) {
            console.error('প্রসেসিং জব স্ট্যাটিসটিক্স লোড করতে সমস্যা:', error);
            throw new Error('প্রসেসিং জব স্ট্যাটিসটিক্স লোড করতে সমস্যা হয়েছে');
        }
    }

    // স্ট্যাটাস অনুযায়ী জব কাউন্ট পাওয়ার জন্য
    // Get job count by status
    static async getCountByStatus(status) {
        try {
            const result = await dbConnection.get(`
                SELECT COUNT(*) as count 
                FROM processing_jobs 
                WHERE status = ?
            `, [status]);

            return result.count;
        } catch (error) {
            console.error('স্ট্যাটাস অনুযায়ী জব কাউন্ট লোড করতে সমস্যা:', error);
            throw new Error('স্ট্যাটাস অনুযায়ী জব কাউন্ট লোড করতে সমস্যা হয়েছে');
        }
    }

    // পুরানো জবগুলি ক্লিনআপ করার জন্য
    // Cleanup old jobs
    static async cleanupOldJobs(daysOld = 30) {
        try {
            const result = await dbConnection.run(`
                DELETE FROM processing_jobs 
                WHERE created_at < datetime('now', '-${daysOld} days')
                AND status IN ('completed', 'failed', 'cancelled')
            `);

            return result.changes;
        } catch (error) {
            console.error('পুরানো জব ক্লিনআপ করতে সমস্যা:', error);
            throw new Error('পুরানো জব ক্লিনআপ করতে সমস্যা হয়েছে');
        }
    }

    // JSON ফরম্যাটে ডেটা রিটার্ন করার জন্য
    // Return data in JSON format
    toJSON() {
        return {
            id: this.id,
            videoId: this.videoId,
            jobType: this.jobType,
            quality: this.quality,
            status: this.status,
            progress: this.progress,
            message: this.message,
            startTime: this.startTime,
            endTime: this.endTime,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
    }
}

module.exports = ProcessingJob;
