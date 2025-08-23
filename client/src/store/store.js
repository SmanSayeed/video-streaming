// Redux store কনফিগারেশন ফাইল
// Redux store configuration file

// Redux Toolkit থেকে configureStore ইমপোর্ট করা হচ্ছে
// Importing configureStore from Redux Toolkit
import { configureStore } from '@reduxjs/toolkit';

// ভিডিও স্লাইস ইমপোর্ট করা হচ্ছে
// Importing video slice
import videoReducer from './slices/videoSlice';

// Redux store কনফিগার করা হচ্ছে
// Configuring Redux store
export const store = configureStore({
    // রিডিউসারগুলি এখানে যোগ করা হবে
    // Reducers will be added here
    reducer: {
        video: videoReducer, // ভিডিও স্টেট ম্যানেজমেন্ট
        // video: videoReducer, // Video state management
    },

    // ডেভেলপমেন্ট টুলস সক্রিয় করা হচ্ছে
    // Enabling development tools
    devTools: process.env.NODE_ENV !== 'production',

    // মিডলওয়্যার কনফিগারেশন (যদি প্রয়োজন হয়)
    // Middleware configuration (if needed)
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            // সিরিয়ালাইজেবল চেক বন্ধ করা হচ্ছে (বড় অবজেক্টের জন্য)
            // Disabling serializable check (for large objects)
            serializableCheck: {
                ignoredActions: ['video/uploadVideo/fulfilled'],
                ignoredPaths: ['video.currentVideo'],
            },
        }),
});

// Store এর টাইপ এক্সপোর্ট করা হচ্ছে (TypeScript এর জন্য)
// Exporting store type (for TypeScript)
export default store;
