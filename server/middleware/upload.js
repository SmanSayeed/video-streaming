// ফাইল আপলোড করার জন্য মিডলওয়্যার
// Middleware for handling file uploads

// multer ইমপোর্ট করা হচ্ছে - এটা ফাইল আপলোড হ্যান্ডল করে
// Importing multer - this handles file uploads
const multer = require('multer');
const path = require('path');
const fs = require('fs-extra');

// আপলোড ফোল্ডার তৈরি করার জন্য ফাংশন
// Function to create upload folders
const createUploadFolders = () => {
    const uploadPath = process.env.UPLOAD_PATH || './uploads';
    const tempPath = process.env.TEMP_PATH || './temp';

    // ফোল্ডারগুলি যদি না থাকে তাহলে তৈরি করে দিচ্ছি
    // Creating folders if they don't exist
    fs.ensureDirSync(uploadPath);
    fs.ensureDirSync(tempPath);

    return { uploadPath, tempPath };
};

// স্টোরেজ কনফিগারেশন - কোথায় ফাইল সেভ হবে
// Storage configuration - where files will be saved
const storage = multer.diskStorage({
    // destination: ফাইল কোথায় সেভ হবে
    // destination: where the file will be saved
    destination: (req, file, cb) => {
        const { tempPath } = createUploadFolders();
        // প্রথমে temp ফোল্ডারে সেভ করছি, পরে process করব
        // First saving in temp folder, then will process
        cb(null, tempPath);
    },

    // filename: ফাইলের নাম কী হবে
    // filename: what the filename will be
    filename: (req, file, cb) => {
        // টাইমস্ট্যাম্প + original নাম দিয়ে unique নাম তৈরি করছি
        // Creating unique name with timestamp + original name
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        const name = path.basename(file.originalname, ext);
        cb(null, `${name}-${uniqueSuffix}${ext}`);
    }
});

// ফাইল ফিল্টার - কোন ফাইল accept করব
// File filter - which files to accept
const fileFilter = (req, file, cb) => {
    // ভিডিও ফাইল এক্সটেনশনগুলি
    // Video file extensions
    const allowedTypes = [
        'video/mp4',
        'video/avi',
        'video/mov',
        'video/wmv',
        'video/flv',
        'video/webm',
        'video/mkv'
    ];

    // ফাইল টাইপ চেক করছি
    // Checking file type
    if (allowedTypes.includes(file.mimetype)) {
        // ভিডিও ফাইল হলে accept করছি
        // Accepting if it's a video file
        cb(null, true);
    } else {
        // ভিডিও ফাইল না হলে reject করছি
        // Rejecting if it's not a video file
        cb(new Error('শুধুমাত্র ভিডিও ফাইল আপলোড করা যাবে!'), false);
    }
};

// multer কনফিগারেশন
// Multer configuration
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        // সর্বোচ্চ ফাইল সাইজ (500MB)
        // Maximum file size (500MB)
        fileSize: parseInt(process.env.MAX_FILE_SIZE) || 500 * 1024 * 1024,
        // একবারে কতগুলো ফাইল আপলোড করতে পারবে
        // How many files can be uploaded at once
        files: 1
    }
});

// সিঙ্গেল ফাইল আপলোড মিডলওয়্যার
// Single file upload middleware
const uploadSingle = upload.single('video');

// এরর হ্যান্ডলিং সহ আপলোড মিডলওয়্যার
// Upload middleware with error handling
const uploadMiddleware = (req, res, next) => {
    uploadSingle(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            // multer এরর হ্যান্ডলিং
            // Handling multer errors
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({
                    error: 'ফাইল সাইজ খুব বড়!',
                    message: 'সর্বোচ্চ 100MB ফাইল আপলোড করা যাবে'
                });
            }
            return res.status(400).json({
                error: 'ফাইল আপলোডে সমস্যা হয়েছে',
                message: err.message
            });
        } else if (err) {
            // অন্য এরর হ্যান্ডলিং
            // Handling other errors
            return res.status(400).json({
                error: 'ফাইল আপলোডে সমস্যা হয়েছে',
                message: err.message
            });
        }

        // সব ঠিক থাকলে পরের মিডলওয়্যারে যাচ্ছি
        // If everything is okay, moving to next middleware
        next();
    });
};

module.exports = {
    uploadMiddleware,
    createUploadFolders
};
