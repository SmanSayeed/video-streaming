// SQLite3 ডাটাবেস কানেকশন এবং ইনিশিয়ালাইজেশন
// SQLite3 Database Connection and Initialization

const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs-extra');

class DatabaseConnection {
    constructor() {
        this.db = null;
        this.dbPath = path.join(__dirname, 'videos.db');
    }

    // ডাটাবেস কানেকশন তৈরি করা হচ্ছে
    // Creating database connection
    async connect() {
        try {
            // ডাটাবেস ডিরেক্টরি তৈরি করা হচ্ছে
            // Creating database directory
            await fs.ensureDir(path.dirname(this.dbPath));

            // SQLite ডাটাবেস কানেকশন তৈরি করা হচ্ছে
            // Creating SQLite database connection
            this.db = new sqlite3.Database(this.dbPath, (err) => {
                if (err) {
                    console.error('❌ ডাটাবেস কানেকশনে সমস্যা:', err.message);
                    throw err;
                }
                console.log('✅ SQLite ডাটাবেসে কানেক্ট হয়েছে:', this.dbPath);
            });

            // ডাটাবেস স্কিমা ইনিশিয়ালাইজ করা হচ্ছে
            // Initializing database schema
            await this.initializeSchema();

            return this.db;
        } catch (error) {
            console.error('❌ ডাটাবেস কানেকশনে সমস্যা:', error);
            throw error;
        }
    }

    // ডাটাবেস স্কিমা ইনিশিয়ালাইজ করা হচ্ছে
    // Initializing database schema
    async initializeSchema() {
        return new Promise((resolve, reject) => {
            const schemaPath = path.join(__dirname, 'schema.sql');
            
            fs.readFile(schemaPath, 'utf8', (err, schema) => {
                if (err) {
                    console.error('❌ স্কিমা ফাইল পড়তে সমস্যা:', err);
                    reject(err);
                    return;
                }

                // স্কিমা এক্সিকিউট করা হচ্ছে
                // Executing schema
                this.db.exec(schema, (err) => {
                    if (err) {
                        console.error('❌ স্কিমা এক্সিকিউট করতে সমস্যা:', err);
                        reject(err);
                        return;
                    }
                    console.log('✅ ডাটাবেস স্কিমা ইনিশিয়ালাইজ হয়েছে');
                    resolve();
                });
            });
        });
    }

    // ডাটাবেস কানেকশন বন্ধ করা হচ্ছে
    // Closing database connection
    async close() {
        return new Promise((resolve, reject) => {
            if (this.db) {
                this.db.close((err) => {
                    if (err) {
                        console.error('❌ ডাটাবেস বন্ধ করতে সমস্যা:', err);
                        reject(err);
                        return;
                    }
                    console.log('✅ ডাটাবেস কানেকশন বন্ধ হয়েছে');
                    this.db = null;
                    resolve();
                });
            } else {
                resolve();
            }
        });
    }

    // ডাটাবেস কানেকশন চেক করা হচ্ছে
    // Checking database connection
    isConnected() {
        return this.db !== null;
    }

    // ডাটাবেস ইনস্ট্যান্স পাওয়া হচ্ছে
    // Getting database instance
    getDatabase() {
        if (!this.db) {
            throw new Error('ডাটাবেস কানেক্ট করা হয়নি। প্রথমে connect() কল করুন।');
        }
        return this.db;
    }

    // প্রমিস-বেসড query মেথড
    // Promise-based query method
    async query(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.all(sql, params, (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    // প্রমিস-বেসড run মেথড
    // Promise-based run method
    async run(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.run(sql, params, function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve({
                        id: this.lastID,
                        changes: this.changes
                    });
                }
            });
        });
    }

    // প্রমিস-বেসড get মেথড
    // Promise-based get method
    async get(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.get(sql, params, (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });
    }
}

// সিঙ্গলটন ইনস্ট্যান্স তৈরি করা হচ্ছে
// Creating singleton instance
const dbConnection = new DatabaseConnection();

module.exports = dbConnection;
