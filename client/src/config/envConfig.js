// Environment Configuration for Video Streaming App
// ভিডিও স্ট্রিমিং অ্যাপের জন্য পরিবেশ কনফিগারেশন

const envConfig = {
    // API Configuration
    API_BASE_URL: process.env.REACT_APP_API_URL || 'https://backend-video.bakebit.com/api',

    // Video Streaming Configuration
    VIDEO_STREAM_URL: (videoId) => `${process.env.REACT_APP_API_URL || 'https://backend-video.bakebit.com/api'}/stream/${videoId}`,

    // Thumbnail Configuration
    THUMBNAIL_URL: (thumbnailPath) => `${process.env.REACT_APP_API_URL || 'https://backend-video.bakebit.com/api'}/thumbnails/${thumbnailPath}`,

    // Upload Configuration
    UPLOAD_URL: `${process.env.REACT_APP_API_URL || 'https://backend-video.bakebit.com/api'}/upload`,

    // Environment
    ENV: process.env.REACT_APP_ENV || 'production',

    // Feature Flags
    FEATURES: {
        AUTO_PLAY: true,
        LOOP_VIDEOS: true,
        SHOW_CONTROLS: true,
        ENABLE_FULLSCREEN: true,
        ENABLE_VOLUME_CONTROL: true,
    },

    // Video Player Settings
    PLAYER: {
        DEFAULT_VOLUME: 0.5,
        CONTROLS_TIMEOUT: 3000,
        BUFFERING_TIMEOUT: 5000,
        MAX_RETRY_ATTEMPTS: 3,
    }
};

export default envConfig;
