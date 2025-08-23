// ভিডিও লাইব্রেরি কম্পোনেন্ট
// Video Library Component

// React এবং প্রয়োজনীয় হুকগুলি ইমপোর্ট করা হচ্ছে
// Importing React and necessary hooks
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

// Redux hooks ইমপোর্ট করা হচ্ছে
// Importing Redux hooks
import { useDispatch, useSelector } from 'react-redux';

// Redux actions ইমপোর্ট করা হচ্ছে
// Importing Redux actions
import { fetchVideos, deleteVideo, setSelectedVideo } from '../store/slices/videoSlice';

// নোটিফিকেশন হুক ইমপোর্ট করা হচ্ছে
// Importing notification hook
import { useNotification } from './Notification';

// ভিডিও লাইব্রেরি কম্পোনেন্ট
// Video Library Component
const VideoLibrary = () => {
  // Redux hooks ব্যবহার করছি
  // Using Redux hooks
  const dispatch = useDispatch();
  const { videos, isLoading, loadingError } = useSelector(state => state.video);

  // নোটিফিকেশন হুক ব্যবহার করছি
  // Using notification hook
  const { showSuccess, showError, showInfo } = useNotification();

  // লোকাল স্টেট
  // Local state
  const [selectedQuality, setSelectedQuality] = useState('720p');

  // কম্পোনেন্ট মাউন্ট হওয়ার পর ভিডিও লোড করছি
  // Loading videos after component mounts
  useEffect(() => {
    dispatch(fetchVideos());
  }, [dispatch]);

  // ভিডিও সিলেক্ট করার জন্য ফাংশন
  // Function for selecting video
  const handleVideoSelect = (video) => {
    dispatch(setSelectedVideo(video));

    // ভিডিও সিলেক্ট নোটিফিকেশন দেখানো হচ্ছে
    // Showing video selection notification
    showInfo('ভিডিও সিলেক্ট হয়েছে! 🎬', `${video.originalName} সিলেক্ট হয়েছে। এখন আপনি এটি প্লে করতে পারেন।`);
  };

  // ভিডিও ডিলিট করার জন্য ফাংশন
  // Function for deleting video
  const handleVideoDelete = async (videoId, videoName) => {
    if (window.confirm(`আপনি কি "${videoName}" ভিডিওটি ডিলিট করতে চান?`)) {
      try {
        await dispatch(deleteVideo(videoId)).unwrap();

        // সফল ডিলিট নোটিফিকেশন দেখানো হচ্ছে
        // Showing successful delete notification
        showSuccess('ভিডিও ডিলিট হয়েছে! 🗑️', `${videoName} সফলভাবে ডিলিট হয়েছে।`);

      } catch (error) {
        console.error('ভিডিও ডিলিটে সমস্যা:', error);

        // এরর নোটিফিকেশন দেখানো হচ্ছে
        // Showing error notification
        showError('ডিলিট ব্যর্থ! ❌', 'ভিডিও ডিলিট করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।');
      }
    }
  };

  // সব ভিডিও ক্লিয়ার করার জন্য ফাংশন
  // Function for clearing all videos
  const handleClearAllVideos = async () => {
    if (window.confirm('আপনি কি সব ভিডিও এবং ডেটা ক্লিয়ার করতে চান? এটি পূর্বাবস্থায় ফেরানো যাবে না।')) {
      try {
        // Clear all videos API call করছি
        // Making clear all videos API call
        const response = await fetch('/api/videos/clear-all', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('ক্লিয়ার করতে সমস্যা হয়েছে');
        }

        // Videos refetch করছি
        // Refetching videos
        dispatch(fetchVideos());

        // সফল ক্লিয়ার নোটিফিকেশন দেখানো হচ্ছে
        // Showing successful clear notification
        showSuccess('সব ডেটা ক্লিয়ার হয়েছে! 🧹', 'সব ভিডিও এবং ডেটা সফলভাবে ক্লিয়ার হয়েছে।');

      } catch (error) {
        console.error('ক্লিয়ার করতে সমস্যা:', error);

        // এরর নোটিফিকেশন দেখানো হচ্ছে
        // Showing error notification
        showError('ক্লিয়ার ব্যর্থ! ❌', 'সব ডেটা ক্লিয়ার করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।');
      }
    }
  };

  // ভিডিও ডুরেশন ফরম্যাট করার জন্য ফাংশন
  // Function for formatting video duration
  const formatDuration = (seconds) => {
    if (!seconds) return '00:00';

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // ভিডিও সাইজ ফরম্যাট করার জন্য ফাংশন
  // Function for formatting video size
  const formatFileSize = (bytes) => {
    if (!bytes) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // আপলোড ডেট ফরম্যাট করার জন্য ফাংশন
  // Function for formatting upload date
  const formatUploadDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('bn-BD', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // লোডিং স্টেট
  // Loading state
  if (isLoading) {
    return (
      <LibraryContainer>
        <LibraryTitle>📚 ভিডিও লাইব্রেরি</LibraryTitle>
        <LoadingMessage>🔄 ভিডিওগুলি লোড হচ্ছে...</LoadingMessage>
      </LibraryContainer>
    );
  }

  // এরর স্টেট
  // Error state
  if (loadingError) {
    return (
      <LibraryContainer>
        <LibraryTitle>📚 ভিডিও লাইব্রেরি</LibraryTitle>
        <ErrorMessage>❌ ভিডিও লোড করতে সমস্যা হয়েছে: {loadingError}</ErrorMessage>
      </LibraryContainer>
    );
  }

  // ভিডিও নেই
  // No videos
  if (!videos || videos.length === 0) {
    return (
      <LibraryContainer>
        <LibraryTitle>📚 ভিডিও লাইব্রেরি</LibraryTitle>
        <EmptyMessage>
          📭 কোন ভিডিও পাওয়া যায়নি
          <EmptySubtext>ভিডিও আপলোড করে শুরু করুন</EmptySubtext>
        </EmptyMessage>
      </LibraryContainer>
    );
  }

  return (
    <LibraryContainer>
      <LibraryHeader>
        <div>
          <LibraryTitle>📚 ভিডিও লাইব্রেরি</LibraryTitle>
          <VideoCount>{videos.length}টি ভিডিও</VideoCount>
        </div>
        <ClearButton onClick={handleClearAllVideos}>
          🧹 সব ক্লিয়ার করুন
        </ClearButton>
      </LibraryHeader>

      {/* কোয়ালিটি ফিল্টার */}
      {/* Quality filter */}
      <QualityFilter>
        <QualityLabel>কোয়ালিটি ফিল্টার:</QualityLabel>
        <QualitySelect
          value={selectedQuality}
          onChange={(e) => setSelectedQuality(e.target.value)}
        >
          <option value="480p">480p</option>
          <option value="720p">720p</option>
          <option value="1080p">1080p</option>
        </QualitySelect>
      </QualityFilter>

      {/* ভিডিও গ্রিড */}
      {/* Video grid */}
      <VideoGrid>
        {videos.map((video) => (
          <VideoCard key={video.id} onClick={() => handleVideoSelect(video)}>
            {/* ভিডিও থাম্বনেইল */}
            {/* Video thumbnail */}
            <VideoThumbnail>
              {video.thumbnail ? (
                <ThumbnailImage src={video.thumbnail} alt={video.originalName} />
              ) : (
                <DefaultThumbnail>🎥</DefaultThumbnail>
              )}

              {/* ভিডিও ডুরেশন */}
              {/* Video duration */}
              {video.duration && (
                <DurationBadge>
                  {formatDuration(video.duration)}
                </DurationBadge>
              )}
            </VideoThumbnail>

            {/* ভিডিও ইনফো */}
            {/* Video info */}
            <VideoInfo>
              <VideoName>{video.originalName}</VideoName>

              <VideoDetails>
                <DetailItem>
                  <DetailIcon>📁</DetailIcon>
                  <DetailText>{formatFileSize(video.fileSize)}</DetailText>
                </DetailItem>

                {video.resolution && (
                  <DetailItem>
                    <DetailIcon>📐</DetailIcon>
                    <DetailText>{video.resolution}</DetailText>
                  </DetailItem>
                )}

                <DetailItem>
                  <DetailIcon>📅</DetailIcon>
                  <DetailText>{formatUploadDate(video.uploadDate)}</DetailText>
                </DetailItem>
              </VideoDetails>

              {/* ভিডিও স্ট্যাটাস */}
              {/* Video status */}
              <VideoStatus $status={video.status}>
                {video.status === 'processing' && '⚙️ প্রসেসিং'}
                {video.status === 'ready' && '✅ প্রস্তুত'}
                {video.status === 'error' && '❌ এরর'}
                {!video.status && '⏳ অপেক্ষমান'}
              </VideoStatus>
            </VideoInfo>

            {/* অ্যাকশন বাটনগুলি */}
            {/* Action buttons */}
            <VideoActions>
              <ActionButton
                onClick={(e) => {
                  e.stopPropagation();
                  handleVideoSelect(video);
                }}
                title="ভিডিও চালান"
              >
                ▶️
              </ActionButton>

              <ActionButton
                onClick={(e) => {
                  e.stopPropagation();
                  handleVideoDelete(video.id, video.originalName);
                }}
                title="ভিডিও ডিলিট করুন"
                $danger
              >
                🗑️
              </ActionButton>
            </VideoActions>
          </VideoCard>
        ))}
      </VideoGrid>
    </LibraryContainer>
  );
};

// স্টাইলড কম্পোনেন্টগুলি
// Styled components

const LibraryContainer = styled.div`
  background: white;
  border-radius: 15px;
  padding: 25px;
  margin-top: 30px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
`;

const LibraryHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
  padding-bottom: 15px;
  border-bottom: 2px solid #f0f0f0;
`;

const LibraryTitle = styled.h2`
  color: #333;
  font-size: 24px;
  margin: 0;
  font-weight: 700;
`;

const VideoCount = styled.span`
  background: linear-gradient(45deg, #667eea, #764ba2);
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
`;

const ClearButton = styled.button`
  background: linear-gradient(45deg, #ff6b6b, #ee5a5a);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: linear-gradient(45deg, #ff5252, #e53e3e);
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(255, 107, 107, 0.3);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const QualityFilter = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 25px;
  gap: 15px;
`;

const QualityLabel = styled.label`
  color: #666;
  font-weight: 600;
  font-size: 14px;
`;

const QualitySelect = styled.select`
  padding: 8px 12px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  background: white;
  color: #333;
  font-size: 14px;
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

const VideoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 25px;
`;

const VideoCard = styled.div`
  background: white;
  border: 2px solid #f0f0f0;
  border-radius: 15px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  
  &:hover {
    border-color: #667eea;
    transform: translateY(-5px);
    box-shadow: 0 15px 40px rgba(102, 126, 234, 0.2);
  }
`;

const VideoThumbnail = styled.div`
  position: relative;
  height: 180px;
  background: #f8f9fa;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ThumbnailImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const DefaultThumbnail = styled.div`
  font-size: 48px;
  color: #ccc;
`;

const DurationBadge = styled.div`
  position: absolute;
  bottom: 10px;
  right: 10px;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
`;

const VideoInfo = styled.div`
  padding: 20px;
`;

const VideoName = styled.h3`
  color: #333;
  font-size: 16px;
  margin: 0 0 15px 0;
  font-weight: 600;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const VideoDetails = styled.div`
  margin-bottom: 15px;
`;

const DetailItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  gap: 8px;
`;

const DetailIcon = styled.span`
  font-size: 14px;
  color: #666;
`;

const DetailText = styled.span`
  color: #666;
  font-size: 13px;
`;

const VideoStatus = styled.div`
  display: inline-block;
  padding: 6px 12px;
  border-radius: 15px;
  font-size: 12px;
  font-weight: 600;
  text-align: center;
  
  ${props => {
    switch (props.$status) {
      case 'processing':
        return `
          background: #fff3cd;
          color: #856404;
          border: 1px solid #ffeaa7;
        `;
      case 'ready':
        return `
          background: #d4edda;
          color: #155724;
          border: 1px solid #c3e6cb;
        `;
      case 'error':
        return `
          background: #f8d7da;
          color: #721c24;
          border: 1px solid #f5c6cb;
        `;
      default:
        return `
          background: #e2e3e5;
          color: #383d41;
          border: 1px solid #d6d8db;
        `;
    }
  }}
`;

const VideoActions = styled.div`
  display: flex;
  gap: 10px;
  padding: 0 20px 20px 20px;
`;

const ActionButton = styled.button`
  background: ${props => props.$danger ? '#ff6b6b' : '#667eea'};
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.3s ease;
  flex: 1;
  
  &:hover {
    background: ${props => props.$danger ? '#ff5252' : '#5a6fd8'};
    transform: translateY(-2px);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 50px;
  color: #666;
  font-size: 18px;
  font-weight: 600;
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 50px;
  color: #dc3545;
  font-size: 16px;
  font-weight: 600;
`;

const EmptyMessage = styled.div`
  text-align: center;
  padding: 50px;
  color: #666;
`;

const EmptySubtext = styled.div`
  font-size: 14px;
  margin-top: 10px;
  opacity: 0.7;
`;

export default VideoLibrary;
