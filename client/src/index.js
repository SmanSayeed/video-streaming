// React অ্যাপ্লিকেশনের মূল এন্ট্রি পয়েন্ট
// Main entry point for React application

// React এবং ReactDOM ইমপোর্ট করা হচ্ছে
// Importing React and ReactDOM
import React from 'react';
import ReactDOM from 'react-dom/client';

// Redux store এবং Provider ইমপোর্ট করা হচ্ছে
// Importing Redux store and Provider
import { Provider } from 'react-redux';
import { store } from './store/store';

// মূল App কম্পোনেন্ট ইমপোর্ট করা হচ্ছে
// Importing main App component
import App from './App';
import ErrorBoundary from './components/ErrorBoundary';

// CSS ফাইল ইমপোর্ট করা হচ্ছে
// Importing CSS file
import './index.css';

// React অ্যাপ্লিকেশন রেন্ডার করা হচ্ছে
// Rendering React application
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        {/* Redux store প্রদান করা হচ্ছে সমস্ত কম্পোনেন্টে */}
        {/* Providing Redux store to all components */}
        <Provider store={store}>
            <ErrorBoundary>
                <App />
            </ErrorBoundary>
        </Provider>
    </React.StrictMode>
);
