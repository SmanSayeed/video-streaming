// ভিডিও ম্যানেজমেন্ট এর জন্য Redux slice
// Redux slice for video management

// Redux Toolkit ইমপোর্ট করা হচ্ছে
// Importing Redux Toolkit
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Axios ইমপোর্ট করা হচ্ছে
// Importing Axios
import axios from 'axios';

// API বেস URL
// API base URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// ভিডিও আপলোড করার জন্য async thunk
// Async thunk for video upload
export const uploadVideo = createAsyncThunk(
    'video/uploadVideo',
    async (formData, { rejectWithValue }) => {
        try {
            // আপলোড API কল করছি
            // Calling upload API
            const response = await axios.post(`${API_BASE_URL}/upload`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                // আপলোড প্রোগ্রেস ট্র্যাক করার জন্য
                // For tracking upload progress
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round(
                        (progressEvent.loaded * 100) / progressEvent.total
                    );
                    console.log(`আপলোড প্রোগ্রেস: ${percentCompleted}%`);
                },
            });

            return response.data;

        } catch (error) {
            // এরর হ্যান্ডলিং
            // Error handling
            const errorMessage = error.response?.data?.message || error.message || 'ভিডিও আপলোডে সমস্যা হয়েছে';
            return rejectWithValue(errorMessage);
        }
    }
);

// সব ভিডিও লোড করার জন্য async thunk
// Async thunk for loading all videos
export const fetchVideos = createAsyncThunk(
    'video/fetchVideos',
    async (_, { rejectWithValue }) => {
        try {
            // ভিডিও লিস্ট API কল করছি
            // Calling video list API
            const response = await axios.get(`${API_BASE_URL}/videos`);
            return response.data;

        } catch (error) {
            // এরর হ্যান্ডলিং
            // Error handling
            const errorMessage = error.response?.data?.message || error.message || 'ভিডিও লোড করতে সমস্যা হয়েছে';
            return rejectWithValue(errorMessage);
        }
    }
);

// ভিডিও ডিটেইলস লোড করার জন্য async thunk
// Async thunk for loading video details
export const fetchVideoDetails = createAsyncThunk(
    'video/fetchVideoDetails',
    async (videoId, { rejectWithValue }) => {
        try {
            // ভিডিও ডিটেইলস API কল করছি
            // Calling video details API
            const response = await axios.get(`${API_BASE_URL}/videos/${videoId}`);
            return response.data;

        } catch (error) {
            // এরর হ্যান্ডলিং
            // Error handling
            const errorMessage = error.response?.data?.message || error.message || 'ভিডিও ডিটেইলস লোড করতে সমস্যা হয়েছে';
            return rejectWithValue(errorMessage);
        }
    }
);

// ভিডিও ডিলিট করার জন্য async thunk
// Async thunk for deleting video
export const deleteVideo = createAsyncThunk(
    'video/deleteVideo',
    async (videoId, { rejectWithValue }) => {
        try {
            // ভিডিও ডিলিট API কল করছি
            // Calling video delete API
            await axios.delete(`${API_BASE_URL}/videos/${videoId}`);
            return videoId;

        } catch (error) {
            // এরর হ্যান্ডলিং
            // Error handling
            const errorMessage = error.response?.data?.message || error.message || 'ভিডিও ডিলিট করতে সমস্যা হয়েছে';
            return rejectWithValue(errorMessage);
        }
    }
);

// ভিডিও কনভার্শন শুরু করার জন্য async thunk
// Async thunk for starting video conversion
export const startVideoConversion = createAsyncThunk(
    'video/startVideoConversion',
    async ({ videoId, quality }, { rejectWithValue }) => {
        try {
            // কনভার্শন API কল করছি
            // Calling conversion API
            const response = await axios.post(`${API_BASE_URL}/processing/convert/${videoId}`, {
                quality: quality || '720p'
            });
            return response.data;

        } catch (error) {
            // এরর হ্যান্ডলিং
            // Error handling
            const errorMessage = error.response?.data?.message || error.message || 'ভিডিও কনভার্শন শুরু করতে সমস্যা হয়েছে';
            return rejectWithValue(errorMessage);
        }
    }
);

// প্রসেসিং স্ট্যাটাস চেক করার জন্য async thunk
// Async thunk for checking processing status
export const checkProcessingStatus = createAsyncThunk(
    'video/checkProcessingStatus',
    async (jobId, { rejectWithValue }) => {
        try {
            // স্ট্যাটাস API কল করছি
            // Calling status API
            const response = await axios.get(`${API_BASE_URL}/processing/status/${jobId}`);
            return response.data;

        } catch (error) {
            // এরর হ্যান্ডলিং
            // Error handling
            const errorMessage = error.response?.data?.message || error.message || 'প্রসেসিং স্ট্যাটাস চেক করতে সমস্যা হয়েছে';
            return rejectWithValue(errorMessage);
        }
    }
);

// সব প্রসেসিং জব লোড করার জন্য async thunk
// Async thunk for loading all processing jobs
export const fetchProcessingJobs = createAsyncThunk(
    'video/fetchProcessingJobs',
    async (_, { rejectWithValue }) => {
        try {
            // প্রসেসিং জব API কল করছি
            // Calling processing jobs API
            const response = await axios.get(`${API_BASE_URL}/processing/jobs`);
            return response.data;

        } catch (error) {
            // এরর হ্যান্ডলিং
            // Error handling
            const errorMessage = error.response?.data?.message || error.message || 'প্রসেসিং জব লোড করতে সমস্যা হয়েছে';
            return rejectWithValue(errorMessage);
        }
    }
);

// ভিডিও slice তৈরি করছি
// Creating video slice
const videoSlice = createSlice({
    name: 'video',

    // ইনিশিয়াল স্টেট
    // Initial state
    initialState: {
        // ভিডিও লিস্ট
        // Video list
        videos: [],

        // সিলেক্টেড ভিডিও
        // Selected video
        selectedVideo: null,

        // আপলোড স্টেট
        // Upload state
        isUploading: false,
        uploadProgress: 0,
        uploadError: null,

        // লোডিং স্টেট
        // Loading state
        isLoading: false,
        loadingError: null,

        // প্রসেসিং জবগুলি
        // Processing jobs
        processingJobs: [],

        // সিলেক্টেড জব
        // Selected job
        selectedJob: null,

        // জব স্ট্যাটাস
        // Job status
        jobStatus: 'idle', // idle, loading, success, error
    },

    // রিডিউসারগুলি
    // Reducers
    reducers: {
        // আপলোড প্রোগ্রেস সেট করার জন্য
        // For setting upload progress
        setUploadProgress: (state, action) => {
            state.uploadProgress = action.payload;
        },

        // আপলোড এরর রিসেট করার জন্য
        // For resetting upload error
        clearUploadError: (state) => {
            state.uploadError = null;
        },

        // লোডিং এরর রিসেট করার জন্য
        // For resetting loading error
        clearLoadingError: (state) => {
            state.loadingError = null;
        },

        // সিলেক্টেড ভিডিও সেট করার জন্য
        // For setting selected video
        setSelectedVideo: (state, action) => {
            state.selectedVideo = action.payload;
        },

        // সিলেক্টেড জব সেট করার জন্য
        // For setting selected job
        setSelectedJob: (state, action) => {
            state.selectedJob = action.payload;
        },

        // ভিডিও লিস্ট আপডেট করার জন্য
        // For updating video list
        updateVideoList: (state, action) => {
            state.videos = action.payload;
        },

        // রিডাক্স স্টোর রিসেট করার জন্য
        // For resetting Redux store
        resetVideoStore: (state) => {
            state.videos = [];
            state.selectedVideo = null;
            state.isLoading = false;
            state.loadingError = null;
            state.isUploading = false;
            state.uploadError = null;
            state.uploadProgress = 0;
            state.processingJobs = [];
            state.selectedJob = null;
            state.jobStatus = 'idle';
        },

        // প্রসেসিং জব আপডেট করার জন্য
        // For updating processing job
        updateProcessingJob: (state, action) => {
            const { jobId, updates } = action.payload;
            const jobIndex = state.processingJobs.findIndex(job => job.id === jobId);

            if (jobIndex !== -1) {
                state.processingJobs[jobIndex] = { ...state.processingJobs[jobIndex], ...updates };
            }
        },
    },

    // Extra reducers (async thunk এর জন্য)
    // Extra reducers (for async thunks)
    extraReducers: (builder) => {
        builder
            // ভিডিও আপলোড
            // Video upload
            .addCase(uploadVideo.pending, (state) => {
                state.isUploading = true;
                state.uploadError = null;
                state.uploadProgress = 0;
            })
            .addCase(uploadVideo.fulfilled, (state, action) => {
                state.isUploading = false;
                state.uploadProgress = 100;
                state.uploadError = null;

                // নতুন ভিডিও লিস্টে যোগ করছি
                // Adding new video to list
                if (action.payload.video) {
                    state.videos.unshift(action.payload.video);
                }
            })
            .addCase(uploadVideo.rejected, (state, action) => {
                state.isUploading = false;
                state.uploadError = action.payload;
                state.uploadProgress = 0;
            })

            // ভিডিও লোড
            // Video loading
            .addCase(fetchVideos.pending, (state) => {
                state.isLoading = true;
                state.loadingError = null;
            })
            .addCase(fetchVideos.fulfilled, (state, action) => {
                state.isLoading = false;
                state.videos = action.payload.videos || [];
                state.loadingError = null;
            })
            .addCase(fetchVideos.rejected, (state, action) => {
                state.isLoading = false;
                state.loadingError = action.payload;
            })

            // ভিডিও ডিটেইলস লোড
            // Video details loading
            .addCase(fetchVideoDetails.pending, (state) => {
                state.isLoading = true;
                state.loadingError = null;
            })
            .addCase(fetchVideoDetails.fulfilled, (state, action) => {
                state.isLoading = false;
                state.selectedVideo = action.payload.video;
                state.loadingError = null;
            })
            .addCase(fetchVideoDetails.rejected, (state, action) => {
                state.isLoading = false;
                state.loadingError = action.payload;
            })

            // ভিডিও ডিলিট
            // Video delete
            .addCase(deleteVideo.fulfilled, (state, action) => {
                // ডিলিটেড ভিডিও লিস্ট থেকে রিমুভ করছি
                // Removing deleted video from list
                state.videos = state.videos.filter(video => video.id !== action.payload);

                // যদি সিলেক্টেড ভিডিও ডিলিট হয় তাহলে রিসেট করছি
                // If selected video is deleted, resetting it
                if (state.selectedVideo && state.selectedVideo.id === action.payload) {
                    state.selectedVideo = null;
                }
            })

            // ভিডিও কনভার্শন
            // Video conversion
            .addCase(startVideoConversion.fulfilled, (state, action) => {
                // নতুন প্রসেসিং জব লিস্টে যোগ করছি
                // Adding new processing job to list
                const newJob = {
                    id: action.payload.jobId,
                    videoId: action.payload.videoId,
                    status: 'queued',
                    progress: 0,
                    message: 'কনভার্শন সারিতে যোগ হয়েছে',
                    startTime: new Date().toISOString(),
                    quality: action.payload.quality || '720p'
                };

                state.processingJobs.unshift(newJob);
            })

            // প্রসেসিং স্ট্যাটাস চেক
            // Processing status check
            .addCase(checkProcessingStatus.fulfilled, (state, action) => {
                // জব স্ট্যাটাস আপডেট করছি
                // Updating job status
                const jobIndex = state.processingJobs.findIndex(job => job.id === action.payload.jobId);

                if (jobIndex !== -1) {
                    state.processingJobs[jobIndex] = { ...state.processingJobs[jobIndex], ...action.payload };
                }
            })

            // প্রসেসিং জব লোড
            // Processing jobs loading
            .addCase(fetchProcessingJobs.pending, (state) => {
                state.jobStatus = 'loading';
            })
            .addCase(fetchProcessingJobs.fulfilled, (state, action) => {
                state.jobStatus = 'success';
                state.processingJobs = action.payload.jobs || [];
            })
            .addCase(fetchProcessingJobs.rejected, (state, action) => {
                state.jobStatus = 'error';
                state.loadingError = action.payload;
            });
    },
});

// Actions এক্সপোর্ট করছি
// Exporting actions
export const {
    setUploadProgress,
    clearUploadError,
    clearLoadingError,
    setSelectedVideo,
    setSelectedJob,
    updateVideoList,
    updateProcessingJob,
    resetVideoStore,
} = videoSlice.actions;

// Selectors এক্সপোর্ট করছি
// Exporting selectors
export const selectVideos = (state) => state.video.videos;
export const selectSelectedVideo = (state) => state.video.selectedVideo;
export const selectIsUploading = (state) => state.video.isUploading;
export const selectUploadProgress = (state) => state.video.uploadProgress;
export const selectUploadError = (state) => state.video.uploadError;
export const selectIsLoading = (state) => state.video.isLoading;
export const selectLoadingError = (state) => state.video.loadingError;
export const selectProcessingJobs = (state) => state.video.processingJobs;
export const selectSelectedJob = (state) => state.video.selectedJob;
export const selectJobStatus = (state) => state.video.jobStatus;

// Reducer এক্সপোর্ট করছি
// Exporting reducer
export default videoSlice.reducer;
