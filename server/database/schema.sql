-- ভিডিও স্ট্রিমিং অ্যাপ্লিকেশনের জন্য SQLite ডাটাবেস স্কিমা
-- SQLite Database Schema for Video Streaming Application

-- ভিডিও টেবিল
-- Videos table
CREATE TABLE IF NOT EXISTS videos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    original_name TEXT NOT NULL,
    filename TEXT NOT NULL UNIQUE,
    file_path TEXT NOT NULL,
    file_size INTEGER NOT NULL,
    mime_type TEXT NOT NULL,
    duration REAL,
    resolution TEXT,
    status TEXT DEFAULT 'uploaded' CHECK (status IN ('uploaded', 'processing', 'ready', 'error')),
    thumbnail_path TEXT,
    upload_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ভিডিও প্রসেসিং জব টেবিল
-- Video Processing Jobs table
CREATE TABLE IF NOT EXISTS processing_jobs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    video_id INTEGER NOT NULL,
    job_type TEXT NOT NULL CHECK (job_type IN ('thumbnail', 'conversion', 'metadata')),
    quality TEXT,
    status TEXT DEFAULT 'queued' CHECK (status IN ('queued', 'processing', 'completed', 'failed', 'cancelled')),
    progress INTEGER DEFAULT 0,
    message TEXT,
    output_path TEXT,
    start_time DATETIME,
    end_time DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (video_id) REFERENCES videos (id) ON DELETE CASCADE
);

-- ভিডিও কনভার্শন টেবিল
-- Video Conversions table
CREATE TABLE IF NOT EXISTS video_conversions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    original_video_id INTEGER NOT NULL,
    quality TEXT NOT NULL CHECK (quality IN ('480p', '720p', '1080p')),
    output_path TEXT NOT NULL,
    file_size INTEGER,
    duration REAL,
    resolution TEXT,
    status TEXT DEFAULT 'processing' CHECK (status IN ('processing', 'completed', 'failed')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    completed_at DATETIME,
    FOREIGN KEY (original_video_id) REFERENCES videos (id) ON DELETE CASCADE
);

-- ইউজার টেবিল (ভবিষ্যতের জন্য)
-- Users table (for future use)
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ভিডিও ভিউ লগ টেবিল
-- Video View Logs table
CREATE TABLE IF NOT EXISTS video_views (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    video_id INTEGER NOT NULL,
    user_ip TEXT,
    user_agent TEXT,
    viewed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (video_id) REFERENCES videos (id) ON DELETE CASCADE
);

-- ইনডেক্স তৈরি করা হচ্ছে
-- Creating indexes
CREATE INDEX IF NOT EXISTS idx_videos_status ON videos(status);
CREATE INDEX IF NOT EXISTS idx_videos_upload_date ON videos(upload_date);
CREATE INDEX IF NOT EXISTS idx_processing_jobs_status ON processing_jobs(status);
CREATE INDEX IF NOT EXISTS idx_processing_jobs_video_id ON processing_jobs(video_id);
CREATE INDEX IF NOT EXISTS idx_video_conversions_original_video_id ON video_conversions(original_video_id);
CREATE INDEX IF NOT EXISTS idx_video_conversions_quality ON video_conversions(quality);

-- ট্রিগার তৈরি করা হচ্ছে (updated_at আপডেট করার জন্য)
-- Creating triggers (for updating updated_at)
CREATE TRIGGER IF NOT EXISTS update_videos_updated_at 
    AFTER UPDATE ON videos
    BEGIN
        UPDATE videos SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
    END;

CREATE TRIGGER IF NOT EXISTS update_processing_jobs_updated_at 
    AFTER UPDATE ON processing_jobs
    BEGIN
        UPDATE processing_jobs SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
    END;

-- স্যাম্পল ডেটা (টেস্টিং এর জন্য)
-- Sample data (for testing)
INSERT OR IGNORE INTO videos (id, original_name, filename, file_path, file_size, mime_type, status) 
VALUES (1, 'sample-video.mp4', 'sample-video-123.mp4', '/uploads/sample-video-123.mp4', 1048576, 'video/mp4', 'ready');

INSERT OR IGNORE INTO processing_jobs (id, video_id, job_type, status, progress, message) 
VALUES (1, 1, 'thumbnail', 'completed', 100, 'Thumbnail generated successfully');
