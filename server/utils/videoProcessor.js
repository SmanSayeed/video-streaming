// ভিডিও প্রসেসিং এর জন্য ইউটিলিটি ফাইল
// Utility file for video processing

// প্রয়োজনীয় মডিউলগুলি ইমপোর্ট করা হচ্ছে
// Importing required modules
const fs = require('fs-extra');
const path = require('path');

// FFmpeg কনফিগারেশন ইমপোর্ট করা হচ্ছে
// Importing FFmpeg configuration
const {
    setFFmpegPaths,
    extractVideoInfo,
    generateThumbnails,
    convertVideo,
    qualityPresets
} = require('./ffmpegConfig');

// FFmpeg পাথ সেট করা হচ্ছে
// Setting FFmpeg paths
setFFmpegPaths();





// ভিডিও প্রসেসিং এর জন্য মেইন ফাংশন
// Main function for video processing
const processVideo = async (videoPath, videoId) => {
    try {
        console.log('ভিডিও প্রসেসিং শুরু হয়েছে:', videoPath);

        // আপলোড ফোল্ডার পাথ নিচ্ছি
        // Getting upload folder path
        const uploadPath = process.env.UPLOAD_PATH || './uploads';
        const thumbnailsPath = path.join(uploadPath, 'thumbnails');

        // থাম্বনেইল ফোল্ডার তৈরি করছি
        // Creating thumbnails folder
        await fs.ensureDir(thumbnailsPath);

        // ভিডিও মেটাডেটা এক্সট্র্যাক্ট করছি
        // Extracting video metadata
        const metadata = await extractVideoInfo(videoPath);
        console.log('ভিডিও মেটাডেটা:', metadata);

        // থাম্বনেইল তৈরি করছি (3টি)
        // Creating thumbnails (3)
        const thumbnailPaths = await generateThumbnails(videoPath, thumbnailsPath, 3);
        const mainThumbnail = thumbnailPaths[0]; // প্রথম থাম্বনেইল

        // প্রসেসিং সম্পূর্ণ রেসপন্স
        // Processing complete response
        return {
            success: true,
            metadata: metadata,
            thumbnail: mainThumbnail,
            thumbnails: thumbnailPaths,
            message: 'ভিডিও সফলভাবে প্রসেস হয়েছে!'
        };

    } catch (error) {
        console.error('ভিডিও প্রসেসিং এ এরর:', error);
        throw error;
    }
};

// মডিউল এক্সপোর্ট করছি
// Exporting module
module.exports = {
    processVideo,
    convertVideo,
    generateThumbnails,
    extractVideoInfo
};
