# 🎬 ভিডিও স্ট্রিমিং অ্যাপ্লিকেশন
# Video Streaming Application

একটি সহজ এবং শক্তিশালী ভিডিও স্ট্রিমিং অ্যাপ্লিকেশন যা Node.js এবং React.js দিয়ে তৈরি করা হয়েছে। এই অ্যাপ্লিকেশন FFmpeg ব্যবহার করে ভিডিও প্রসেসিং এবং স্ট্রিমিং করে।

A simple and powerful video streaming application built with Node.js and React.js. This application uses FFmpeg for video processing and streaming.

## ✨ ফিচারগুলি
## Features

### 🎥 ভিডিও ম্যানেজমেন্ট
### Video Management
- **ভিডিও আপলোড**: ড্র্যাগ এন্ড ড্রপ সহ সহজ আপলোড
- **Video Upload**: Easy upload with drag and drop support
- **ফাইল ভ্যালিডেশন**: সাপোর্টেড ফরম্যাট এবং সাইজ চেক
- **File Validation**: Supported format and size checking
- **ভিডিও লাইব্রেরি**: আপলোড করা ভিডিওগুলির তালিকা
- **Video Library**: List of uploaded videos

### 🎮 ভিডিও প্লেয়ার
### Video Player
- **বেসিক কন্ট্রোলস**: প্লে/পজ, ভলিউম, মিউট
- **Basic Controls**: Play/pause, volume, mute
- **এডভান্সড ফিচার**: সিকিং, প্লেব্যাক স্পিড, ফুলস্ক্রিন
- **Advanced Features**: Seeking, playback speed, fullscreen
- **অটো-হাইড কন্ট্রোলস**: মাউস মুভমেন্টে কন্ট্রোলস দেখানো
- **Auto-hide Controls**: Show controls on mouse movement
- **বাফারিং ইন্ডিকেটর**: লোডিং স্টেট দেখানো
- **Buffering Indicator**: Show loading state

### 🔄 ভিডিও প্রসেসিং
### Video Processing
- **FFmpeg ইন্টিগ্রেশন**: ভিডিও মেটাডেটা এক্সট্রাকশন
- **FFmpeg Integration**: Video metadata extraction
- **থাম্বনেইল জেনারেশন**: স্বয়ংক্রিয় থাম্বনেইল তৈরি
- **Thumbnail Generation**: Automatic thumbnail creation
- **কোয়ালিটি কনভার্শন**: বিভিন্ন রেজোলিউশনে কনভার্ট
- **Quality Conversion**: Convert to different resolutions
- **প্রসেসিং জব**: ব্যাকগ্রাউন্ডে ভিডিও প্রসেসিং
- **Processing Jobs**: Background video processing

### 🔔 নোটিফিকেশন সিস্টেম
### Notification System
- **রিয়েল-টাইম আপডেট**: সফল/ব্যর্থ অপারেশন জানানো
- **Real-time Updates**: Notify successful/failed operations
- **অটো-ডিসমিস**: সময়ের পর স্বয়ংক্রিয়ভাবে বন্ধ
- **Auto-dismiss**: Automatically close after time
- **মাল্টিপল টাইপ**: সাকসেস, এরর, ওয়ার্নিং, ইনফো
- **Multiple Types**: Success, error, warning, info
- **সুন্দর UI**: অ্যানিমেটেড নোটিফিকেশন
- **Beautiful UI**: Animated notifications

### 🎨 ইউজার ইন্টারফেস
### User Interface
- **মডার্ন ডিজাইন**: সুন্দর এবং রেসপন্সিভ UI
- **Modern Design**: Beautiful and responsive UI
- **স্টাইলড কম্পোনেন্টস**: CSS-in-JS স্টাইলিং
- **Styled Components**: CSS-in-JS styling
- **লোডিং স্পিনার**: বিভিন্ন সাইজের স্পিনার
- **Loading Spinner**: Spinners of different sizes
- **এরর বাউন্ডারি**: ইউজার-ফ্রেন্ডলি এরর হ্যান্ডলিং
- **Error Boundary**: User-friendly error handling

## 🛠️ টেকনোলজি স্ট্যাক
## Technology Stack

### 🖥️ ব্যাকএন্ড
### Backend
- **Node.js**: JavaScript রানটাইম
- **Node.js**: JavaScript runtime
- **Express.js**: ওয়েব ফ্রেমওয়ার্ক
- **Express.js**: Web framework
- **FFmpeg**: ভিডিও প্রসেসিং
- **FFmpeg**: Video processing
- **Multer**: ফাইল আপলোড হ্যান্ডলিং
- **Multer**: File upload handling

### 🎨 ফ্রন্টএন্ড
### Frontend
- **React.js**: ইউজার ইন্টারফেস লাইব্রেরি
- **React.js**: User interface library
- **Redux Toolkit**: স্টেট ম্যানেজমেন্ট
- **Redux Toolkit**: State management
- **Styled Components**: CSS-in-JS স্টাইলিং
- **Styled Components**: CSS-in-JS styling
- **Axios**: HTTP ক্লায়েন্ট
- **Axios**: HTTP client

## 📦 ইনস্টলেশন
## Installation

### 1. প্রজেক্ট ক্লোন করুন
### 1. Clone the project
```bash
git clone <repository-url>
cd video-streaming-app
```

### 2. ডিপেন্ডেন্সি ইনস্টল করুন
### 2. Install dependencies
```bash
npm run install-all
```

### 3. FFmpeg ইনস্টল করুন
### 3. Install FFmpeg

#### Windows (Chocolatey)
```bash
choco install ffmpeg-full
```

#### macOS (Homebrew)
```bash
brew install ffmpeg
```

#### Ubuntu/Debian
```bash
sudo apt update
sudo apt install ffmpeg
```

### 4. এনভায়রনমেন্ট ভেরিয়েবল সেট করুন
### 4. Set environment variables
```bash
cp example.env .env
# .env ফাইল এডিট করে আপনার সেটিংস করুন
# Edit .env file with your settings
```

### 5. অ্যাপ্লিকেশন চালু করুন
### 5. Start the application
```bash
npm run dev
```

## 🚀 ব্যবহার
## Usage

### 🎥 ভিডিও আপলোড
### Video Upload
1. **ড্র্যাগ এন্ড ড্রপ**: ভিডিও ফাইল ড্র্যাগ করে আপলোড এরিয়ায় ছাড়ুন
1. **Drag and Drop**: Drag video file to upload area
2. **ফাইল সিলেক্ট**: ক্লিক করে ফাইল সিলেক্ট করুন
2. **File Select**: Click to select file
3. **আপলোড**: আপলোড বাটনে ক্লিক করুন
3. **Upload**: Click upload button

### 🎮 ভিডিও প্লে
### Video Play
1. **ভিডিও সিলেক্ট**: লাইব্রেরি থেকে ভিডিও সিলেক্ট করুন
1. **Select Video**: Select video from library
2. **কন্ট্রোলস**: প্লে, পজ, ভলিউম, সিকিং ব্যবহার করুন
2. **Controls**: Use play, pause, volume, seeking
3. **ফুলস্ক্রিন**: ফুলস্ক্রিন বাটনে ক্লিক করুন
3. **Fullscreen**: Click fullscreen button

### 🔄 ভিডিও কনভার্শন
### Video Conversion
1. **ভিডিও বেছে নিন**: ড্রপডাউন থেকে ভিডিও সিলেক্ট করুন
1. **Choose Video**: Select video from dropdown
2. **কোয়ালিটি সিলেক্ট**: রেডিও বাটন দিয়ে কোয়ালিটি বেছে নিন
2. **Select Quality**: Choose quality with radio buttons
3. **কনভার্ট**: কনভার্ট বাটনে ক্লিক করুন
3. **Convert**: Click convert button

## 📡 API এন্ডপয়েন্টস
## API Endpoints

### 🎥 ভিডিও ম্যানেজমেন্ট
### Video Management
- `POST /api/upload` - ভিডিও আপলোড
- `POST /api/upload` - Upload video
- `GET /api/videos` - ভিডিও তালিকা
- `GET /api/videos` - List videos
- `GET /api/videos/:id` - ভিডিও বিবরণ
- `GET /api/videos/:id` - Video details
- `DELETE /api/videos/:id` - ভিডিও ডিলিট
- `DELETE /api/videos/:id` - Delete video

### 📺 ভিডিও স্ট্রিমিং
### Video Streaming
- `GET /api/stream/:id` - ভিডিও স্ট্রিম
- `GET /api/stream/:id` - Stream video
- `GET /api/stream/:id/thumbnail` - থাম্বনেইল
- `GET /api/stream/:id/thumbnail` - Thumbnail

### 🔄 ভিডিও প্রসেসিং
### Video Processing
- `GET /api/processing/status/:id` - প্রসেসিং স্ট্যাটাস
- `GET /api/processing/status/:id` - Processing status
- `POST /api/processing/convert/:id` - ভিডিও কনভার্শন
- `POST /api/processing/convert/:id` - Video conversion
- `GET /api/processing/jobs` - প্রসেসিং জব তালিকা
- `GET /api/processing/jobs` - Processing jobs list
- `DELETE /api/processing/cancel/:jobId` - জব বাতিল
- `DELETE /api/processing/cancel/:jobId` - Cancel job

## 🧪 টেস্টিং
## Testing

### সার্ভার টেস্ট
### Server Test
```bash
npm run test-server
```

### FFmpeg টেস্ট
### FFmpeg Test
```bash
npm run test-ffmpeg
```

### ক্লায়েন্ট টেস্ট
### Client Test
```bash
cd client
npm test
```

## 📁 প্রজেক্ট স্ট্রাকচার
## Project Structure

```
video-streaming-app/
├── client/                 # React ফ্রন্টএন্ড
│   ├── public/            # স্ট্যাটিক ফাইল
│   ├── src/
│   │   ├── components/    # React কম্পোনেন্টস
│   │   ├── store/         # Redux store
│   │   └── index.js       # এন্ট্রি পয়েন্ট
├── server/                 # Node.js ব্যাকএন্ড
│   ├── middleware/        # Express middleware
│   ├── routes/            # API routes
│   ├── utils/             # ইউটিলিটি ফাংশনস
│   └── index.js           # সার্ভার এন্ট্রি
├── uploads/               # আপলোড করা ভিডিও
├── .env                   # এনভায়রনমেন্ট ভেরিয়েবল
├── example.env            # এনভায়রনমেন্ট টেমপ্লেট
└── README.md              # প্রজেক্ট ডকুমেন্টেশন
```

## 🔧 কনফিগারেশন
## Configuration

### এনভায়রনমেন্ট ভেরিয়েবল
### Environment Variables

```env
# সার্ভার কনফিগারেশন
# Server Configuration
PORT=5000
NODE_ENV=development

# ফাইল আপলোড
# File Upload
MAX_FILE_SIZE=104857600
UPLOAD_DIR=uploads

# FFmpeg পাথ
# FFmpeg Paths
FFMPEG_PATH=C:\ffmpeg\bin\ffmpeg.exe
FFPROBE_PATH=C:\ffmpeg\bin\ffprobe.exe

# ভিডিও কোয়ালিটি
# Video Quality
VIDEO_QUALITIES=480p,720p,1080p

# CORS
CORS_ORIGIN=http://localhost:3000
```

## 🐛 সমস্যা সমাধান
## Troubleshooting

### FFmpeg এরর
### FFmpeg Error
- **পাথ চেক**: `.env` ফাইলে সঠিক FFmpeg পাথ আছে কিনা দেখুন
- **Path Check**: Verify correct FFmpeg path in .env file
- **ইনস্টলেশন**: FFmpeg সঠিকভাবে ইনস্টল হয়েছে কিনা চেক করুন
- **Installation**: Check if FFmpeg is properly installed

### আপলোড এরর
### Upload Error
- **ফাইল সাইজ**: 100MB এর কম ফাইল আপলোড করুন
- **File Size**: Upload files smaller than 100MB
- **ফরম্যাট**: সাপোর্টেড ভিডিও ফরম্যাট ব্যবহার করুন
- **Format**: Use supported video formats

### স্ট্রিমিং এরর
### Streaming Error
- **সার্ভার**: সার্ভার চালু আছে কিনা চেক করুন
- **Server**: Check if server is running
- **পোর্ট**: সঠিক পোর্টে সার্ভার চালু আছে কিনা দেখুন
- **Port**: Verify server is running on correct port

## 🤝 অবদান
## Contributing

1. **ফর্ক**: প্রজেক্টটি ফর্ক করুন
1. **Fork**: Fork the project
2. **ব্রাঞ্চ**: নতুন ফিচার ব্রাঞ্চ তৈরি করুন
2. **Branch**: Create feature branch
3. **কমিট**: আপনার পরিবর্তন কমিট করুন
3. **Commit**: Commit your changes
4. **পুল রিকোয়েস্ট**: PR সাবমিট করুন
4. **Pull Request**: Submit PR

## 📄 লাইসেন্স
## License

এই প্রজেক্টটি MIT লাইসেন্সের অধীনে লাইসেন্সকৃত।

This project is licensed under the MIT License.

## 🙏 ধন্যবাদ
## Acknowledgments

- **FFmpeg**: ভিডিও প্রসেসিং
- **FFmpeg**: Video processing
- **React**: ইউজার ইন্টারফেস
- **React**: User interface
- **Node.js**: সার্ভার-সাইড রানটাইম
- **Node.js**: Server-side runtime
- **Styled Components**: CSS-in-JS স্টাইলিং
- **Styled Components**: CSS-in-JS styling

---

**🎬 ভিডিও স্ট্রিমিং অ্যাপ্লিকেশন** - আপনার ভিডিও আপলোড এবং স্ট্রিমিং অভিজ্ঞতা সহজ এবং আনন্দদায়ক করে তুলুন!

**🎬 Video Streaming Application** - Make your video upload and streaming experience simple and enjoyable!
