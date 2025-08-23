# 🚀 ভিডিও স্ট্রিমিং API ডকুমেন্টেশন
# Video Streaming API Documentation

## 📋 Overview

এই API ডকুমেন্টেশনটি ভিডিও স্ট্রিমিং অ্যাপ্লিকেশনের জন্য তৈরি করা হয়েছে। সব endpoints Postman এ test করা যাবে।

This API documentation is created for the video streaming application. All endpoints can be tested with Postman.

## 🌐 Base URL

```
http://localhost:5000
```

## 🔐 Authentication

বর্তমানে কোন authentication নেই। সব endpoints public।

Currently no authentication required. All endpoints are public.

## 📡 API Endpoints

### 🎥 Video Management

#### 1. Get All Videos
- **Method**: `GET`
- **URL**: `/api/videos`
- **Description**: সব ভিডিওর তালিকা পাওয়া
- **Response**: 
```json
{
  "success": true,
  "count": 2,
  "videos": [
    {
      "id": 1,
      "originalName": "sample-video.mp4",
      "filename": "sample-video-123.mp4",
      "filePath": "/uploads/sample-video-123.mp4",
      "fileSize": 1048576,
      "mimeType": "video/mp4",
      "duration": null,
      "resolution": null,
      "status": "ready",
      "thumbnailPath": null,
      "uploadDate": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### 2. Get Video by ID
- **Method**: `GET`
- **URL**: `/api/videos/:id`
- **Description**: নির্দিষ্ট ID দিয়ে ভিডিও পাওয়া
- **Parameters**: `id` (path parameter)
- **Response**: 
```json
{
  "success": true,
  "video": {
    "id": 1,
    "originalName": "sample-video.mp4",
    "filename": "sample-video-123.mp4",
    "filePath": "/uploads/sample-video-123.mp4",
    "fileSize": 1048576,
    "mimeType": "video/mp4",
    "duration": null,
    "resolution": null,
    "status": "ready",
    "thumbnailPath": null,
    "uploadDate": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### 3. Upload Video
- **Method**: `POST`
- **URL**: `/api/upload`
- **Description**: নতুন ভিডিও আপলোড করা
- **Content-Type**: `multipart/form-data`
- **Body**: 
  - `video`: ভিডিও ফাইল (video file)
- **Response**: 
```json
{
  "success": true,
  "message": "ভিডিও সফলভাবে আপলোড হয়েছে",
  "videoId": 2,
  "video": {
    "id": 2,
    "originalName": "my-video.mp4",
    "filename": "my-video-123.mp4",
    "filePath": "/uploads/my-video-123.mp4",
    "fileSize": 5242880,
    "mimeType": "video/mp4",
    "status": "uploaded"
  }
}
```

#### 4. Update Video
- **Method**: `PUT`
- **URL**: `/api/videos/:id`
- **Description**: ভিডিও তথ্য আপডেট করা
- **Parameters**: `id` (path parameter)
- **Body**: 
```json
{
  "originalName": "updated-video.mp4",
  "status": "ready"
}
```
- **Response**: 
```json
{
  "success": true,
  "message": "ভিডিও সফলভাবে আপডেট হয়েছে",
  "video": {
    "id": 1,
    "originalName": "updated-video.mp4",
    "status": "ready"
  }
}
```

#### 5. Delete Video
- **Method**: `DELETE`
- **URL**: `/api/videos/:id`
- **Description**: ভিডিও ডিলিট করা
- **Parameters**: `id` (path parameter)
- **Response**: 
```json
{
  "success": true,
  "message": "ভিডিও সফলভাবে ডিলিট হয়েছে"
}
```

#### 6. Update Video Status
- **Method**: `PATCH`
- **URL**: `/api/videos/:id/status`
- **Description**: ভিডিও স্ট্যাটাস আপডেট করা
- **Parameters**: `id` (path parameter)
- **Body**: 
```json
{
  "status": "processing"
}
```
- **Response**: 
```json
{
  "success": true,
  "message": "ভিডিও স্ট্যাটাস সফলভাবে আপডেট হয়েছে",
  "video": {
    "id": 1,
    "status": "processing"
  }
}
```

#### 7. Get Video Statistics
- **Method**: `GET`
- **URL**: `/api/videos/stats/overview`
- **Description**: ভিডিও স্ট্যাটিসটিক্স পাওয়া
- **Response**: 
```json
{
  "success": true,
  "stats": {
    "total": 5,
    "total_size": 10485760,
    "avg_size": 2097152,
    "ready_count": 3,
    "processing_count": 1,
    "error_count": 1
  }
}
```

#### 8. Get Videos by Status
- **Method**: `GET`
- **URL**: `/api/videos/status/:status`
- **Description**: নির্দিষ্ট স্ট্যাটাস অনুযায়ী ভিডিও পাওয়া
- **Parameters**: `status` (path parameter) - `uploaded`, `processing`, `ready`, `error`
- **Response**: 
```json
{
  "success": true,
  "count": 2,
  "status": "ready",
  "videos": [
    {
      "id": 1,
      "status": "ready"
    }
  ]
}
```

#### 9. Clear All Videos and Data
- **Method**: `DELETE`
- **URL**: `/api/videos/clear-all`
- **Description**: সব ভিডিও, ফাইল এবং ডেটাবেস ডেটা ক্লিয়ার করা
- **Response**: 
```json
{
  "success": true,
  "message": "সব ভিডিও এবং ডেটা সফলভাবে ক্লিয়ার হয়েছে",
  "deletedVideos": 5
}
```

### 📺 Video Streaming

#### 9. Stream Video
- **Method**: `GET`
- **URL**: `/api/stream/:id`
- **Description**: ভিডিও স্ট্রিম করা
- **Parameters**: `id` (path parameter)
- **Headers**: 
  - `Range`: `bytes=0-` (for seeking)
- **Response**: Video file stream

#### 10. Get Video Thumbnail
- **Method**: `GET`
- **URL**: `/api/stream/:id/thumbnail`
- **Description**: ভিডিও থাম্বনেইল পাওয়া
- **Parameters**: `id` (path parameter)
- **Response**: Thumbnail image

### 🔄 Video Processing

#### 11. Get Processing Jobs
- **Method**: `GET`
- **URL**: `/api/processing/jobs`
- **Description**: সব প্রসেসিং জব পাওয়া
- **Response**: 
```json
{
  "success": true,
  "jobs": [
    {
      "id": 1,
      "videoId": 1,
      "jobType": "thumbnail",
      "quality": null,
      "status": "completed",
      "progress": 100,
      "message": "Thumbnail generated successfully",
      "startTime": "2024-01-01T00:00:00.000Z",
      "endTime": "2024-01-01T00:01:00.000Z"
    }
  ]
}
```

#### 12. Create Processing Job
- **Method**: `POST`
- **URL**: `/api/processing/jobs`
- **Description**: নতুন প্রসেসিং জব তৈরি করা
- **Body**: 
```json
{
  "videoId": 1,
  "jobType": "convert",
  "quality": "720p"
}
```
- **Response**: 
```json
{
  "success": true,
  "message": "প্রসেসিং জব সফলভাবে তৈরি হয়েছে",
  "job": {
    "id": 2,
    "videoId": 1,
    "jobType": "convert",
    "status": "queued"
  }
}
```

#### 13. Check Job Status (by ID)
- **Method**: `GET`
- **URL**: `/api/processing/status/:id`
- **Description**: জব ID দিয়ে প্রসেসিং স্ট্যাটাস চেক করা
- **Parameters**: `id` (job ID - path parameter)
- **Response**: 
```json
{
  "success": true,
  "job": {
    "id": 2,
    "videoId": 1,
    "status": "processing",
    "progress": 45,
    "message": "প্রসেসিং চলছে..."
  }
}
```

#### 14. Get Jobs by Status
- **Method**: `GET`
- **URL**: `/api/processing/status/by/:status`
- **Description**: স্ট্যাটাস অনুযায়ী প্রসেসিং জব পাওয়া
- **Parameters**: `status` (string status - path parameter) - `queued`, `processing`, `completed`, `failed`, `cancelled`
- **Response**: 
```json
{
  "success": true,
  "status": "processing",
  "count": 2,
  "jobs": [
    {
      "id": 2,
      "status": "processing"
    }
  ]
}
```

#### 14. Cancel Processing Job
- **Method**: `DELETE`
- **URL**: `/api/processing/cancel/:jobId`
- **Description**: প্রসেসিং জব বাতিল করা
- **Parameters**: `jobId` (path parameter)
- **Response**: 
```json
{
  "success": true,
  "message": "জব বাতিল হয়েছে"
}
```

### 📊 General

#### 15. Server Status
- **Method**: `GET`
- **URL**: `/`
- **Description**: সার্ভার স্ট্যাটাস চেক করা
- **Response**: 
```json
{
  "message": "ভিডিও স্ট্রিমিং API সার্ভার চলছে",
  "status": "running",
  "environment": "development"
}
```

## 🧪 Postman Testing

### 📥 Import Collection

1. Postman খুলুন
2. Import বাটনে ক্লিক করুন
3. Raw text এ নিচের JSON paste করুন:

```json
{
  "info": {
    "name": "Video Streaming API",
    "description": "Complete API collection for video streaming application",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Video Management",
      "item": [
        {
          "name": "Get All Videos",
          "request": {
            "method": "GET",
            "url": "{{baseUrl}}/api/videos"
          }
        },
        {
          "name": "Get Video by ID",
          "request": {
            "method": "GET",
            "url": "{{baseUrl}}/api/videos/1"
          }
        },
        {
          "name": "Upload Video",
          "request": {
            "method": "POST",
            "url": "{{baseUrl}}/api/upload",
            "body": {
              "mode": "formdata",
              "formdata": [
                {
                  "key": "video",
                  "type": "file",
                  "src": []
                }
              ]
            }
          }
        },
        {
          "name": "Update Video",
          "request": {
            "method": "PUT",
            "url": "{{baseUrl}}/api/videos/1",
            "body": {
              "mode": "raw",
              "raw": "{\n  \"status\": \"ready\"\n}",
              "options": {
                "raw": {
                  "language": "json"
                }
              }
            }
          }
        },
        {
          "name": "Delete Video",
          "request": {
            "method": "DELETE",
            "url": "{{baseUrl}}/api/videos/1"
          }
        }
      ]
    },
    {
      "name": "Video Processing",
      "item": [
        {
          "name": "Get Processing Jobs",
          "request": {
            "method": "GET",
            "url": "{{baseUrl}}/api/processing/jobs"
          }
        },
        {
          "name": "Start Video Conversion",
          "request": {
            "method": "POST",
            "url": "{{baseUrl}}/api/processing/convert/1",
            "body": {
              "mode": "raw",
              "raw": "{\n  \"quality\": \"720p\"\n}",
              "options": {
                "raw": {
                  "language": "json"
                }
              }
            }
          }
        },
        {
          "name": "Check Processing Status",
          "request": {
            "method": "GET",
            "url": "{{baseUrl}}/api/processing/status/1"
          }
        }
      ]
    }
  ],
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:5000"
    }
  ]
}
```

### 🔧 Environment Variables

Postman এ environment variable সেট করুন:

- **Variable**: `baseUrl`
- **Value**: `http://localhost:5000`

## 📝 Error Responses

সব endpoints এ error response এর format একই:

All endpoints return errors in the same format:

```json
{
  "success": false,
  "error": "Error title",
  "message": "Detailed error message"
}
```

## 🚀 Testing Steps

1. **সার্ভার চালু করুন**: `npm start` (server folder এ)
2. **Postman Collection Import করুন**
3. **Environment Variable সেট করুন**
4. **Endpoints Test করুন**

## 📚 Status Codes

- `200`: Success
- `201`: Created
- `400`: Bad Request
- `404`: Not Found
- `500`: Internal Server Error

## 🔍 Notes

- সব responses এ `success` field থাকে
- Error responses এ `success: false` থাকে
- File uploads এর জন্য `multipart/form-data` ব্যবহার করুন
- Video streaming এর জন্য `Range` header ব্যবহার করুন

---

**🎬 ভিডিও স্ট্রিমিং API** - আপনার ভিডিও আপলোড এবং স্ট্রিমিং অভিজ্ঞতা সহজ এবং আনন্দদায়ক করে তুলুন!

**🎬 Video Streaming API** - Make your video upload and streaming experience simple and enjoyable!
