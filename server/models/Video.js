// ভিডিও মডেল - ডাটাবেস অপারেশনগুলি
// Video Model - Database Operations

const dbConnection = require('../database/connection');

class Video {
    constructor(data = {}) {
        this.id = data.id;
        this.originalName = data.original_name;
        this.filename = data.filename;
        this.filePath = data.file_path;
        this.fileSize = data.file_size;
        this.mimeType = data.mime_type;
        this.duration = data.duration;
        this.resolution = data.resolution;
        this.status = data.status || 'uploaded';
        this.thumbnailPath = data.thumbnail_path;
        this.uploadDate = data.upload_date;
        this.updatedAt = data.updated_at;
    }

    // সব ভিডিও পাওয়া হচ্ছে
    // Getting all videos
    static async findAll() {
        try {
            const db = dbConnection.getDatabase();
            const sql = `
                SELECT * FROM videos 
                ORDER BY upload_date DESC
            `;
            const rows = await dbConnection.query(sql);
            return rows.map(row => new Video(row));
        } catch (error) {
            console.error('❌ ভিডিও লিস্ট লোড করতে সমস্যা:', error);
            throw error;
        }
    }

    // ID দিয়ে ভিডিও পাওয়া হচ্ছে
    // Getting video by ID
    static async findById(id) {
        try {
            const db = dbConnection.getDatabase();
            const sql = 'SELECT * FROM videos WHERE id = ?';
            const row = await dbConnection.get(sql, [id]);
            return row ? new Video(row) : null;
        } catch (error) {
            console.error('❌ ভিডিও লোড করতে সমস্যা:', error);
            throw error;
        }
    }

    // ফাইলের নাম দিয়ে ভিডিও পাওয়া হচ্ছে
    // Getting video by filename
    static async findByFilename(filename) {
        try {
            const db = dbConnection.getDatabase();
            const sql = 'SELECT * FROM videos WHERE filename = ?';
            const row = await dbConnection.get(sql, [filename]);
            return row ? new Video(row) : null;
        } catch (error) {
            console.error('❌ ভিডিও লোড করতে সমস্যা:', error);
            throw error;
        }
    }

    // নতুন ভিডিও তৈরি করা হচ্ছে
    // Creating new video
    static async create(videoData) {
        try {
            const db = dbConnection.getDatabase();
            const sql = `
                INSERT INTO videos (
                    original_name, filename, file_path, file_size, 
                    mime_type, duration, resolution, status, thumbnail_path
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;
            
            const params = [
                videoData.originalName,
                videoData.filename,
                videoData.filePath,
                videoData.fileSize,
                videoData.mimeType,
                videoData.duration || null,
                videoData.resolution || null,
                videoData.status || 'uploaded',
                videoData.thumbnailPath || null
            ];

            const result = await dbConnection.run(sql, params);
            return result.id;
        } catch (error) {
            console.error('❌ ভিডিও তৈরি করতে সমস্যা:', error);
            throw error;
        }
    }

    // ভিডিও আপডেট করা হচ্ছে
    // Updating video
    async update(updateData) {
        try {
            const db = dbConnection.getDatabase();
            const sql = `
                UPDATE videos SET 
                    original_name = ?, filename = ?, file_path = ?, 
                    file_size = ?, mime_type = ?, duration = ?, 
                    resolution = ?, status = ?, thumbnail_path = ?
                WHERE id = ?
            `;
            
            const params = [
                updateData.originalName || this.originalName,
                updateData.filename || this.filename,
                updateData.filePath || this.filePath,
                updateData.fileSize || this.fileSize,
                updateData.mimeType || this.mimeType,
                updateData.duration || this.duration,
                updateData.resolution || this.resolution,
                updateData.status || this.status,
                updateData.thumbnailPath || this.thumbnailPath,
                this.id
            ];

            const result = await dbConnection.run(sql, params);
            return result.changes > 0;
        } catch (error) {
            console.error('❌ ভিডিও আপডেট করতে সমস্যা:', error);
            throw error;
        }
    }

    // ভিডিও ডিলিট করা হচ্ছে
    // Deleting video
    async delete() {
        try {
            const db = dbConnection.getDatabase();
            const sql = 'DELETE FROM videos WHERE id = ?';
            const result = await dbConnection.run(sql, [this.id]);
            return result.changes > 0;
        } catch (error) {
            console.error('❌ ভিডিও ডিলিট করতে সমস্যা:', error);
            throw error;
        }
    }

    // স্ট্যাটাস আপডেট করা হচ্ছে
    // Updating status
    async updateStatus(status) {
        try {
            const db = dbConnection.getDatabase();
            const sql = 'UPDATE videos SET status = ? WHERE id = ?';
            const result = await dbConnection.run(sql, [status, this.id]);
            
            if (result.changes > 0) {
                this.status = status;
                return true;
            }
            return false;
        } catch (error) {
            console.error('❌ স্ট্যাটাস আপডেট করতে সমস্যা:', error);
            throw error;
        }
    }

    // থাম্বনেইল পাথ আপডেট করা হচ্ছে
    // Updating thumbnail path
    async updateThumbnail(thumbnailPath) {
        try {
            const db = dbConnection.getDatabase();
            const sql = 'UPDATE videos SET thumbnail_path = ? WHERE id = ?';
            const result = await dbConnection.run(sql, [thumbnailPath, this.id]);
            
            if (result.changes > 0) {
                this.thumbnailPath = thumbnailPath;
                return true;
            }
            return false;
        } catch (error) {
            console.error('❌ থাম্বনেইল আপডেট করতে সমস্যা:', error);
            throw error;
        }
    }

    // মেটাডেটা আপডেট করা হচ্ছে
    // Updating metadata
    async updateMetadata(metadata) {
        try {
            const db = dbConnection.getDatabase();
            const sql = `
                UPDATE videos SET 
                    duration = ?, resolution = ?
                WHERE id = ?
            `;
            
            const params = [
                metadata.duration || this.duration,
                metadata.resolution || this.resolution,
                this.id
            ];

            const result = await dbConnection.run(sql, params);
            
            if (result.changes > 0) {
                this.duration = metadata.duration || this.duration;
                this.resolution = metadata.resolution || this.resolution;
                return true;
            }
            return false;
        } catch (error) {
            console.error('❌ মেটাডেটা আপডেট করতে সমস্যা:', error);
            throw error;
        }
    }

    // স্ট্যাটাস অনুযায়ী ভিডিও পাওয়া হচ্ছে
    // Getting videos by status
    static async findByStatus(status) {
        try {
            const db = dbConnection.getDatabase();
            const sql = 'SELECT * FROM videos WHERE status = ? ORDER BY upload_date DESC';
            const rows = await dbConnection.query(sql, [status]);
            return rows.map(row => new Video(row));
        } catch (error) {
            console.error('❌ স্ট্যাটাস অনুযায়ী ভিডিও লোড করতে সমস্যা:', error);
            throw error;
        }
    }

    // স্ট্যাটিসটিক্স পাওয়া হচ্ছে
    // Getting statistics
    static async getStats() {
        try {
            const db = dbConnection.getDatabase();
            const sql = `
                SELECT 
                    COUNT(*) as total,
                    SUM(file_size) as total_size,
                    AVG(file_size) as avg_size,
                    COUNT(CASE WHEN status = 'ready' THEN 1 END) as ready_count,
                    COUNT(CASE WHEN status = 'processing' THEN 1 END) as processing_count,
                    COUNT(CASE WHEN status = 'error' THEN 1 END) as error_count
                FROM videos
            `;
            
            const row = await dbConnection.get(sql);
            return row;
        } catch (error) {
            console.error('❌ স্ট্যাটিসটিক্স লোড করতে সমস্যা:', error);
            throw error;
        }
    }

    // JSON ফরম্যাটে রূপান্তর করা হচ্ছে
    // Converting to JSON format
    toJSON() {
        return {
            id: this.id,
            originalName: this.originalName,
            filename: this.filename,
            filePath: this.filePath,
            fileSize: this.fileSize,
            mimeType: this.mimeType,
            duration: this.duration,
            resolution: this.resolution,
            status: this.status,
            thumbnailPath: this.thumbnailPath,
            uploadDate: this.uploadDate,
            updatedAt: this.updatedAt
        };
    }
}

module.exports = Video;
