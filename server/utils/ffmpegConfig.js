// FFmpeg কনফিগারেশন এবং সেটিংস ফাইল
// FFmpeg configuration and settings file

// FFmpeg ইমপোর্ট করা হচ্ছে
// Importing FFmpeg
const ffmpeg = require('fluent-ffmpeg');
const path = require('path');

// FFmpeg পাথ সেট করা হচ্ছে
// Setting FFmpeg paths
const setFFmpegPaths = () => {
    try {
        // Windows এ FFmpeg পাথ সেট করছি
        // Setting FFmpeg path on Windows
        if (process.env.FFMPEG_PATH) {
            ffmpeg.setFfmpegPath(process.env.FFMPEG_PATH);
            console.log('✅ FFmpeg পাথ সেট হয়েছে:', process.env.FFMPEG_PATH);
        }

        if (process.env.FFPROBE_PATH) {
            ffmpeg.setFfprobePath(process.env.FFPROBE_PATH);
            console.log('✅ FFprobe পাথ সেট হয়েছে:', process.env.FFPROBE_PATH);
        }

        // FFmpeg ভার্সন চেক করছি
        // Checking FFmpeg version
        ffmpeg.getAvailableCodecs((err, codecs) => {
            if (err) {
                console.error('❌ FFmpeg কোডেক লোড করতে সমস্যা:', err.message);
            } else {
                console.log('✅ FFmpeg সফলভাবে লোড হয়েছে');
                console.log('📊 উপলব্ধ ভিডিও কোডেক সংখ্যা:', Object.keys(codecs).filter(k => k.startsWith('v')).length);
            }
        });

    } catch (error) {
        console.error('❌ FFmpeg পাথ সেট করতে সমস্যা:', error.message);
    }
};

// ভিডিও কোয়ালিটি প্রিসেট তৈরি করা হচ্ছে
// Creating video quality presets
const qualityPresets = {
    // 480p - কম কোয়ালিটি, দ্রুত স্ট্রিমিং
    // 480p - low quality, fast streaming
    '480p': {
        width: 854,
        height: 480,
        videoBitrate: '800k',
        audioBitrate: '128k',
        fps: 30,
        crf: 28
    },

    // 720p - মাঝারি কোয়ালিটি, ব্যালেন্সড
    // 720p - medium quality, balanced
    '720p': {
        width: 1280,
        height: 720,
        videoBitrate: '1500k',
        audioBitrate: '192k',
        fps: 30,
        crf: 23
    },

    // 1080p - উচ্চ কোয়ালিটি, স্লো স্ট্রিমিং
    // 1080p - high quality, slow streaming
    '1080p': {
        width: 1920,
        height: 1080,
        videoBitrate: '3000k',
        audioBitrate: '256k',
        fps: 30,
        crf: 20
    }
};

// ভিডিও ফরম্যাট সাপোর্ট চেক করা হচ্ছে
// Checking video format support
const supportedFormats = [
    'mp4', 'avi', 'mov', 'wmv', 'flv', 'webm', 'mkv',
    'm4v', '3gp', 'ogv', 'ts', 'mts', 'm2ts'
];

// ভিডিও কোডেক সাপোর্ট চেক করা হচ্ছে
// Checking video codec support
const supportedCodecs = {
    video: ['h264', 'h265', 'vp8', 'vp9', 'av1'],
    audio: ['aac', 'mp3', 'opus', 'vorbis', 'flac']
};

// FFmpeg কমান্ড অপশন তৈরি করা হচ্ছে
// Creating FFmpeg command options
const createFFmpegOptions = (quality = '720p') => {
    const preset = qualityPresets[quality] || qualityPresets['720p'];

    return {
        // ভিডিও সেটিংস
        // Video settings
        videoCodec: 'libx264',
        audioCodec: 'aac',
        size: `${preset.width}x${preset.height}`,
        videoBitrate: preset.videoBitrate,
        audioBitrate: preset.audioBitrate,
        fps: preset.fps,
        crf: preset.crf,

        // আউটপুট অপশনগুলি
        // Output options
        outputOptions: [
            '-preset', 'fast',           // এনকোডিং স্পিড
            '-movflags', '+faststart',   // ওয়েব স্ট্রিমিং এর জন্য
            '-pix_fmt', 'yuv420p',      // কম্প্যাটিবিলিটি
            '-g', '60',                  // GOP সাইজ
            '-keyint_min', '30',        // মিনিমাম keyframe
            '-sc_threshold', '0',        // scene change detection
            '-bf', '2',                  // B-frames
            '-refs', '3'                 // reference frames
        ],

        // অডিও সেটিংস
        // Audio settings
        audioChannels: 2,
        audioFrequency: 44100
    };
};

// ভিডিও ইনফো এক্সট্র্যাক্ট করার জন্য ফাংশন
// Function to extract video info
const extractVideoInfo = (videoPath) => {
    return new Promise((resolve, reject) => {
        // FFprobe দিয়ে ভিডিও ইনফরমেশন নিচ্ছি
        // Getting video information with FFprobe
        ffmpeg.ffprobe(videoPath, (err, metadata) => {
            if (err) {
                reject(new Error(`ভিডিও ইনফো এক্সট্র্যাক্ট করতে সমস্যা: ${err.message}`));
                return;
            }

            try {
                // ভিডিও স্ট্রিম খুঁজছি
                // Finding video stream
                const videoStream = metadata.streams.find(s => s.codec_type === 'video');
                const audioStream = metadata.streams.find(s => s.codec_type === 'audio');

                if (!videoStream) {
                    reject(new Error('ভিডিও স্ট্রিম পাওয়া যায়নি'));
                    return;
                }

                // ভিডিও ইনফরমেশন তৈরি করছি
                // Creating video information
                const videoInfo = {
                    // বেসিক ইনফো
                    // Basic info
                    duration: parseFloat(metadata.format.duration) || 0,
                    size: parseInt(metadata.format.size) || 0,
                    bitrate: parseInt(metadata.format.bit_rate) || 0,
                    format: metadata.format.format_name,

                    // ভিডিও স্ট্রিম ইনফো
                    // Video stream info
                    video: {
                        codec: videoStream.codec_name,
                        width: videoStream.width,
                        height: videoStream.height,
                        fps: eval(videoStream.r_frame_rate) || 0,
                        bitrate: parseInt(videoStream.bit_rate) || 0,
                        pixelFormat: videoStream.pix_fmt,
                        aspectRatio: videoStream.display_aspect_ratio
                    },

                    // অডিও স্ট্রিম ইনফো
                    // Audio stream info
                    audio: audioStream ? {
                        codec: audioStream.codec_name,
                        channels: audioStream.channels,
                        sampleRate: audioStream.sample_rate,
                        bitrate: parseInt(audioStream.bit_rate) || 0
                    } : null,

                    // মেটাডেটা
                    // Metadata
                    metadata: metadata.format.tags || {}
                };

                resolve(videoInfo);

            } catch (parseError) {
                reject(new Error(`ভিডিও ইনফো পার্স করতে সমস্যা: ${parseError.message}`));
            }
        });
    });
};

// ভিডিও থাম্বনেইল জেনারেট করার জন্য ফাংশন
// Function to generate video thumbnails
const generateThumbnails = (videoPath, outputDir, count = 3) => {
    return new Promise((resolve, reject) => {
        try {
            // ভিডিওর দৈর্ঘ্য বের করছি
            // Getting video duration
            ffmpeg.ffprobe(videoPath, (err, metadata) => {
                if (err) {
                    reject(new Error(`ভিডিও ডুরেশন চেক করতে সমস্যা: ${err.message}`));
                    return;
                }

                const duration = parseFloat(metadata.format.duration) || 0;
                if (duration === 0) {
                    reject(new Error('ভিডিওর দৈর্ঘ্য শূন্য'));
                    return;
                }

                // থাম্বনেইল টাইমস্ট্যাম্প তৈরি করছি
                // Creating thumbnail timestamps
                const timestamps = [];
                for (let i = 1; i <= count; i++) {
                    const time = (duration * i) / (count + 1);
                    timestamps.push(time);
                }

                // থাম্বনেইল জেনারেট করছি
                // Generating thumbnails
                ffmpeg(videoPath)
                    .screenshots({
                        timestamps: timestamps,
                        filename: 'thumb-%i.jpg',
                        folder: outputDir,
                        size: '320x180'
                    })
                    .on('end', () => {
                        console.log(`✅ ${count}টি থাম্বনেইল সফলভাবে তৈরি হয়েছে`);
                        resolve(timestamps.map((_, i) => path.join(outputDir, `thumb-${i + 1}.jpg`)));
                    })
                    .on('error', (err) => {
                        reject(new Error(`থাম্বনেইল তৈরি করতে সমস্যা: ${err.message}`));
                    });
            });

        } catch (error) {
            reject(new Error(`থাম্বনেইল জেনারেশন সেটআপে সমস্যা: ${error.message}`));
        }
    });
};

// ভিডিও কনভার্শন ফাংশন
// Video conversion function
const convertVideo = (inputPath, outputPath, quality = '720p') => {
    return new Promise((resolve, reject) => {
        try {
            const options = createFFmpegOptions(quality);

            // FFmpeg কমান্ড তৈরি করছি
            // Creating FFmpeg command
            let command = ffmpeg(inputPath)
                .size(options.size)
                .videoCodec(options.videoCodec)
                .audioCodec(options.audioCodec)
                .videoBitrate(options.videoBitrate)
                .audioBitrate(options.audioBitrate)
                .fps(options.fps)
                .audioChannels(options.audioChannels)
                .audioFrequency(options.audioFrequency);

            // আউটপুট অপশনগুলি যোগ করছি
            // Adding output options
            options.outputOptions.forEach(option => {
                command = command.outputOption(option);
            });

            // প্রোগ্রেস ট্র্যাকিং
            // Progress tracking
            command.on('progress', (progress) => {
                console.log(`🔄 কনভার্শন: ${Math.round(progress.percent)}% সম্পূর্ণ`);
            });

            // সফল কনভার্শন
            // Successful conversion
            command.on('end', () => {
                console.log(`✅ ভিডিও সফলভাবে কনভার্ট হয়েছে: ${outputPath}`);
                resolve(outputPath);
            });

            // এরর হ্যান্ডলিং
            // Error handling
            command.on('error', (err) => {
                reject(new Error(`ভিডিও কনভার্শনে সমস্যা: ${err.message}`));
            });

            // কনভার্শন শুরু করছি
            // Starting conversion
            command.save(outputPath);

        } catch (error) {
            reject(new Error(`FFmpeg কমান্ড সেটআপে সমস্যা: ${error.message}`));
        }
    });
};

// মডিউল এক্সপোর্ট করছি
// Exporting module
module.exports = {
    setFFmpegPaths,
    qualityPresets,
    supportedFormats,
    supportedCodecs,
    createFFmpegOptions,
    extractVideoInfo,
    generateThumbnails,
    convertVideo
};
