// ভিডিও আপলোড করার জন্য কম্পোনেন্ট
// Component for video upload

// React এবং প্রয়োজনীয় হুকগুলি ইমপোর্ট করা হচ্ছে
// Importing React and necessary hooks
import React, { useState, useRef, useCallback } from 'react';
import styled from 'styled-components';

// Redux hooks ইমপোর্ট করা হচ্ছে
// Importing Redux hooks
import { useDispatch, useSelector } from 'react-redux';

// Redux actions ইমপোর্ট করা হচ্ছে
// Importing Redux actions
import { uploadVideo } from '../store/slices/videoSlice';

// নোটিফিকেশন হুক ইমপোর্ট করা হচ্ছে
// Importing notification hook
import { useNotification } from './Notification';

// ভিডিও আপলোডার কম্পোনেন্ট
// Video Uploader Component
const VideoUploader = () => {
  // লোকাল স্টেট ডিফাইন করছি
  // Defining local state
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setLocalProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState('idle'); // idle, uploading, success, error
  const [errorMessage, setErrorMessage] = useState('');

  // Redux hooks ব্যবহার করছি
  // Using Redux hooks
  const dispatch = useDispatch();
  const { isUploading } = useSelector(state => state.video);

      // নোটিফিকেশন হুক ব্যবহার করছি
    // Using notification hook
    const { showSuccess, showError } = useNotification();

  // ফাইল ইনপুট রেফারেন্স
  // File input reference
  const fileInputRef = useRef(null);

  // ফাইল ভ্যালিডেশন ফাংশন
  // File validation function
  const validateFile = (file) => {
    // সাপোর্টেড ভিডিও ফরম্যাট
    // Supported video formats
    const supportedFormats = ['video/mp4', 'video/avi', 'video/mov', 'video/wmv', 'video/flv', 'video/webm', 'video/mkv'];

    // ফরম্যাট চেক করছি
    // Checking format
    if (!supportedFormats.includes(file.type)) {
      throw new Error('এই ভিডিও ফরম্যাট সাপোর্টেড নয়। সাপোর্টেড ফরম্যাট: MP4, AVI, MOV, WMV, FLV, WebM, MKV');
    }

    // ফাইল সাইজ চেক করছি (500MB)
    // Checking file size (500MB)
    const maxSize = 500 * 1024 * 1024; // 500MB in bytes
    if (file.size > maxSize) {
      throw new Error('ফাইল সাইজ খুব বড়। সর্বোচ্চ সাইজ: 500MB');
    }

    return true;
  };

  // ফাইল সিলেক্ট করার জন্য ফাংশন
  // Function for selecting files
  const handleFileSelect = useCallback((file) => {
    try {
      // এরর মেসেজ রিসেট করছি
      // Resetting error message
      setErrorMessage('');

      // ফাইল ভ্যালিডেশন করছি
      // Validating file
      validateFile(file);

      // সিলেক্টেড ফাইল সেট করছি
      // Setting selected file
      setSelectedFile(file);
      setUploadStatus('idle');

        } catch (error) {
      setErrorMessage(error.message);
      setSelectedFile(null);
      
      // ফাইল ভ্যালিডেশন এরর নোটিফিকেশন দেখানো হচ্ছে
      // Showing file validation error notification
      showError('ফাইল ভ্যালিডেশন ব্যর্থ! ❌', error.message);
    }
  }, [showError]);

  // ফাইল ইনপুট চেঞ্জ হ্যান্ডলার
  // File input change handler
  const handleFileInputChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  // ড্র্যাগ এন্ড ড্রপ হ্যান্ডলারগুলি
  // Drag and drop handlers
  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragIn = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setDragActive(true);
    }
  }, []);

  const handleDragOut = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      handleFileSelect(file);
      e.dataTransfer.clearData();
    }
  }, [handleFileSelect]);

  // ভিডিও আপলোড করার জন্য ফাংশন
  // Function for uploading video
  const handleUpload = async () => {
    if (!selectedFile) {
      setErrorMessage('কোন ফাইল সিলেক্ট করা হয়নি');
      return;
    }

    try {
      // আপলোড স্ট্যাটাস সেট করছি
      // Setting upload status
      setUploadStatus('uploading');
      setLocalProgress(0);

      // FormData তৈরি করছি
      // Creating FormData
      const formData = new FormData();
      formData.append('video', selectedFile);

                  // Redux action dispatch করছি
            // Dispatching Redux action
            await dispatch(uploadVideo(formData)).unwrap();

      // সফল আপলোড
      // Successful upload
      setUploadStatus('success');
      setLocalProgress(100);
      setSelectedFile(null);

      // সফল আপলোড নোটিফিকেশন দেখানো হচ্ছে
      // Showing success upload notification
      showSuccess(
        'ভিডিও আপলোড সফল! 🎉',
        `${selectedFile.name} সফলভাবে আপলোড হয়েছে এবং প্রসেসিং শুরু হয়েছে।`
      );

      // 3 সেকেন্ড পর স্ট্যাটাস রিসেট করছি
      // Resetting status after 3 seconds
      setTimeout(() => {
        setUploadStatus('idle');
        setLocalProgress(0);
      }, 3000);

    } catch (error) {
      // এরর হ্যান্ডলিং
      // Error handling
      setUploadStatus('error');
      setErrorMessage(error.message || 'ভিডিও আপলোডে সমস্যা হয়েছে');

      // এরর নোটিফিকেশন দেখানো হচ্ছে
      // Showing error notification
      showError(
        'আপলোড ব্যর্থ! ❌',
        error.message || 'ভিডিও আপলোডে সমস্যা হয়েছে। আবার চেষ্টা করুন।'
      );
    }
  };

  // ফাইল রিমুভ করার জন্য ফাংশন
  // Function for removing file
  const handleRemoveFile = () => {
    setSelectedFile(null);
    setUploadStatus('idle');
    setLocalProgress(0);
    setErrorMessage('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // ফাইল সাইজ ফরম্যাট করার জন্য ফাংশন
  // Function for formatting file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <UploaderContainer>
      <UploaderTitle>🎬 ভিডিও আপলোড করুন</UploaderTitle>
      <UploaderSubtitle>আপনার ভিডিও ফাইল এখানে আপলোড করুন</UploaderSubtitle>

      {/* ড্র্যাগ এন্ড ড্রপ এরিয়া */}
      {/* Drag and Drop Area */}
              <DragDropArea
          $dragActive={dragActive}
          onDragEnter={handleDragIn}
          onDragLeave={handleDragOut}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
        <DragDropContent>
          <UploadIcon>📁</UploadIcon>
          <DragDropText>
            {dragActive ? 'ফাইল এখানে ছাড়ুন' : 'ফাইল এখানে ক্লিক করুন বা টেনে আনুন'}
          </DragDropText>
          <DragDropSubtext>
            সাপোর্টেড ফরম্যাট: MP4, AVI, MOV, WMV, FLV, WebM, MKV
          </DragDropSubtext>
          <DragDropSubtext>
            সর্বোচ্চ সাইজ: 500MB
          </DragDropSubtext>
        </DragDropContent>

        {/* হিডেন ফাইল ইনপুট */}
        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="video/*"
          onChange={handleFileInputChange}
          style={{ display: 'none' }}
        />
      </DragDropArea>

      {/* সিলেক্টেড ফাইল ইনফো */}
      {/* Selected file info */}
      {selectedFile && (
        <SelectedFileInfo>
          <FileIcon>🎥</FileIcon>
          <FileDetails>
            <FileName>{selectedFile.name}</FileName>
            <FileSize>{formatFileSize(selectedFile.size)}</FileSize>
            <FileType>{selectedFile.type}</FileType>
          </FileDetails>
          <RemoveButton onClick={handleRemoveFile}>❌</RemoveButton>
        </SelectedFileInfo>
      )}

      {/* এরর মেসেজ */}
      {/* Error message */}
      {errorMessage && (
        <ErrorMessage>
          ❌ {errorMessage}
        </ErrorMessage>
      )}

      {/* আপলোড বাটন */}
      {/* Upload button */}
      {selectedFile && uploadStatus === 'idle' && (
        <UploadButton onClick={handleUpload} disabled={isUploading}>
          {isUploading ? 'আপলোড হচ্ছে...' : 'ভিডিও আপলোড করুন'}
        </UploadButton>
      )}

      {/* আপলোড প্রোগ্রেস */}
      {/* Upload progress */}
      {uploadStatus === 'uploading' && (
        <ProgressContainer>
          <ProgressBar>
            <ProgressFill progress={uploadProgress} />
          </ProgressBar>
          <ProgressText>{uploadProgress}% সম্পূর্ণ</ProgressText>
        </ProgressContainer>
      )}

      {/* সফল আপলোড মেসেজ */}
      {/* Successful upload message */}
      {uploadStatus === 'success' && (
        <SuccessMessage>
          ✅ ভিডিও সফলভাবে আপলোড হয়েছে!
        </SuccessMessage>
      )}
    </UploaderContainer>
  );
};

// স্টাইলড কম্পোনেন্টগুলি
// Styled components

const UploaderContainer = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  text-align: center;
  max-width: 600px;
  margin: 0 auto;
`;

const UploaderTitle = styled.h2`
  color: white;
  font-size: 28px;
  margin-bottom: 10px;
  font-weight: 700;
`;

const UploaderSubtitle = styled.p`
  color: rgba(255, 255, 255, 0.8);
  font-size: 16px;
  margin-bottom: 30px;
`;

const DragDropArea = styled.div`
  border: 3px dashed ${props => props.$dragActive ? '#4CAF50' : 'rgba(255, 255, 255, 0.5)'};
  border-radius: 15px;
  padding: 40px 20px;
  background: ${props => props.$dragActive ? 'rgba(76, 175, 80, 0.1)' : 'rgba(255, 255, 255, 0.1)'};
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 20px;
  
  &:hover {
    border-color: #4CAF50;
    background: rgba(76, 175, 80, 0.1);
  }
`;

const DragDropContent = styled.div`
  color: white;
`;

const UploadIcon = styled.div`
  font-size: 48px;
  margin-bottom: 15px;
`;

const DragDropText = styled.div`
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 10px;
`;

const DragDropSubtext = styled.div`
  font-size: 14px;
  opacity: 0.8;
  margin-bottom: 5px;
`;

const SelectedFileInfo = styled.div`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: 15px;
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  backdrop-filter: blur(10px);
`;

const FileIcon = styled.div`
  font-size: 24px;
  margin-right: 15px;
`;

const FileDetails = styled.div`
  flex: 1;
  text-align: left;
`;

const FileName = styled.div`
  color: white;
  font-weight: 600;
  margin-bottom: 5px;
`;

const FileSize = styled.div`
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;
  margin-bottom: 3px;
`;

const FileType = styled.div`
  color: rgba(255, 255, 255, 0.6);
  font-size: 12px;
`;

const RemoveButton = styled.button`
  background: none;
  border: none;
  color: #ff6b6b;
  font-size: 18px;
  cursor: pointer;
  padding: 5px;
  border-radius: 5px;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 107, 107, 0.2);
    transform: scale(1.1);
  }
`;

const ErrorMessage = styled.div`
  background: rgba(255, 107, 107, 0.2);
  color: #ff6b6b;
  padding: 15px;
  border-radius: 10px;
  margin-bottom: 20px;
  font-weight: 600;
`;

const UploadButton = styled.button`
  background: linear-gradient(45deg, #4CAF50, #45a049);
  color: white;
  border: none;
  padding: 15px 30px;
  border-radius: 25px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 5px 15px rgba(76, 175, 80, 0.3);
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(76, 175, 80, 0.4);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ProgressContainer = styled.div`
  margin-top: 20px;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 10px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 5px;
  overflow: hidden;
  margin-bottom: 10px;
`;

const ProgressFill = styled.div`
  height: 100%;
  background: linear-gradient(90deg, #4CAF50, #45a049);
  width: ${props => props.progress}%;
  transition: width 0.3s ease;
`;

const ProgressText = styled.div`
  color: white;
  font-weight: 600;
`;

const SuccessMessage = styled.div`
  background: rgba(76, 175, 80, 0.2);
  color: #4CAF50;
  padding: 15px;
  border-radius: 10px;
  font-weight: 600;
  margin-top: 20px;
`;

export default VideoUploader;
