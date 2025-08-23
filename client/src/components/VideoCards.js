// ভিডিও কার্ডস কম্পোনেন্ট - মোবাইল রেসপন্সিভ TikTok-style ভিডিও কার্ডস
// Video Cards Component - Mobile responsive TikTok-style video cards

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchVideos } from '../store/slices/videoSlice';
import { useNotification } from './Notification';
import InlineVideoPlayer from './InlineVideoPlayer';

const VideoCards = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { videos, loading, error } = useSelector(state => state.video);

  const [likes, setLikes] = useState({});
  const [comments, setComments] = useState({});
  const [playingVideoId, setPlayingVideoId] = useState(null);
  const { showSuccess } = useNotification();

  useEffect(() => {
    dispatch(fetchVideos());
  }, [dispatch]);

  useEffect(() => {
    // Initialize likes and comments for each video
    if (videos) {
      const initialLikes = {};
      const initialComments = {};
      videos.forEach(video => {
        initialLikes[video.id] = Math.floor(Math.random() * 100) + 10;
        initialComments[video.id] = Math.floor(Math.random() * 20) + 2;
      });
      setLikes(initialLikes);
      setComments(initialComments);
    }
  }, [videos]);

  const handleVideoSelect = (video) => {
    // Toggle inline video player
    if (playingVideoId === video.id) {
      setPlayingVideoId(null);
    } else {
      setPlayingVideoId(video.id);
    }
  };

  const handleLike = (videoId, e) => {
    e.stopPropagation();
    setLikes(prev => ({
      ...prev,
      [videoId]: prev[videoId] + 1
    }));
    showSuccess('❤️ লাইক করা হয়েছে!', 'ভিডিওটি লাইক করা হয়েছে');
  };

  const handleComment = (videoId, e) => {
    e.stopPropagation();
    const commentText = prompt('আপনার মন্তব্য লিখুন:');
    if (commentText && commentText.trim()) {
      setComments(prev => ({
        ...prev,
        [videoId]: prev[videoId] + 1
      }));
      showSuccess('💬 মন্তব্য যোগ হয়েছে!', 'আপনার মন্তব্য সফলভাবে যোগ হয়েছে');
    }
  };

  const handleShare = (videoId, e) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: 'ভিডিও শেয়ার করুন',
        text: 'এই ভিডিওটি দেখুন',
        url: window.location.href
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href);
      showSuccess('🔗 লিংক কপি হয়েছে!', 'ভিডিও লিংক ক্লিপবোর্ডে কপি হয়েছে');
    }
  };

  if (loading) {
    return (
      <LoadingContainer>
        <LoadingSpinner>⏳</LoadingSpinner>
        <LoadingText>ভিডিও লোড হচ্ছে...</LoadingText>
      </LoadingContainer>
    );
  }

  if (error) {
    return (
      <ErrorContainer>
        <ErrorIcon>❌</ErrorIcon>
        <ErrorText>ভিডিও লোড করতে সমস্যা হয়েছে: {error}</ErrorText>
      </ErrorContainer>
    );
  }

  if (!videos || videos.length === 0) {
    return (
      <EmptyContainer>
        <EmptyIcon>📹</EmptyIcon>
        <EmptyTitle>কোন ভিডিও নেই</EmptyTitle>
        <EmptyText>এখনও কোন ভিডিও আপলোড করা হয়নি</EmptyText>
      </EmptyContainer>
    );
  }

  return (
    <VideoCardsContainer>
      <VideoCardsHeader>
        <HeaderTitle>🎬 ভিডিও শর্টস</HeaderTitle>
        <HeaderSubtitle>টিকটক স্টাইলে ভিডিও দেখুন</HeaderSubtitle>
        <AdminButton onClick={() => navigate('/admin')}>
          🔐 অ্যাডমিন প্যানেল
        </AdminButton>
      </VideoCardsHeader>

      <VideoCardsGrid>
        {videos.map((video) => (
          <VideoCard key={video.id}>
            <VideoThumbnail>
              {playingVideoId === video.id ? (
                <InlineVideoPlayer
                  videoId={video.id}
                  onClose={() => setPlayingVideoId(null)}
                />
              ) : (
                <>
                  {video.thumbnailPath ? (
                    <ThumbnailImage src={video.thumbnailPath} alt={video.originalName} />
                  ) : (
                    <ThumbnailPlaceholder>
                      <ThumbnailIcon>🎥</ThumbnailIcon>
                    </ThumbnailPlaceholder>
                  )}
                  <VideoDuration>3:45</VideoDuration>
                  <PlayButton onClick={() => handleVideoSelect(video)}>
                    ▶️
                  </PlayButton>
                </>
              )}
            </VideoThumbnail>

            <VideoInfo>
              <VideoTitle>{video.originalName}</VideoTitle>
              <VideoMeta>
                <VideoViews>{Math.floor(Math.random() * 1000) + 100} views</VideoViews>
                <VideoTime>2 hours ago</VideoTime>
              </VideoMeta>
            </VideoInfo>

            <VideoActions>
              <ActionButton onClick={(e) => handleLike(video.id, e)}>
                <ActionIcon>❤️</ActionIcon>
                <ActionCount>{likes[video.id] || 0}</ActionCount>
              </ActionButton>

              <ActionButton onClick={(e) => handleComment(video.id, e)}>
                <ActionIcon>💬</ActionIcon>
                <ActionCount>{comments[video.id] || 0}</ActionCount>
              </ActionButton>

              <ActionButton onClick={(e) => handleShare(video.id, e)}>
                <ActionIcon>🔗</ActionIcon>
                <ActionCount>Share</ActionCount>
              </ActionButton>
            </VideoActions>
          </VideoCard>
        ))}
      </VideoCardsGrid>


    </VideoCardsContainer>
  );
};

// স্টাইলড কম্পোনেন্টস
// Styled Components

const VideoCardsContainer = styled.div`
  min-height: 100vh;
  background: #000;
  color: white;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
`;

const VideoCardsHeader = styled.header`
  text-align: center;
  padding: 40px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
`;

const HeaderTitle = styled.h1`
  font-size: 3rem;
  margin: 0 0 10px 0;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
`;

const HeaderSubtitle = styled.p`
  font-size: 1.2rem;
  margin: 0;
  opacity: 0.9;
`;

const AdminButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  padding: 12px 24px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 20px;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    border-color: rgba(255, 255, 255, 0.5);
    transform: translateY(-2px);
  }
`;

const VideoCardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    padding: 15px;
  }
`;

const VideoCard = styled.div`
  background: #1a1a1a;
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 35px rgba(0, 0, 0, 0.4);
  }
`;

const VideoThumbnail = styled.div`
  position: relative;
  width: 100%;
  height: 200px;
  background: #2a2a2a;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ThumbnailImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const ThumbnailPlaceholder = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
`;

const ThumbnailIcon = styled.div`
  font-size: 4rem;
  opacity: 0.5;
`;

const VideoDuration = styled.div`
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

const PlayButton = styled.button`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.7);
  border: none;
  color: white;
  font-size: 3rem;
  opacity: 0.8;
  transition: all 0.3s ease;
  cursor: pointer;
  border-radius: 50%;
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    opacity: 1;
    background: rgba(0, 0, 0, 0.9);
    transform: translate(-50%, -50%) scale(1.1);
  }
`;

const VideoInfo = styled.div`
  padding: 15px;
`;

const VideoTitle = styled.h3`
  font-size: 1.1rem;
  margin: 0 0 10px 0;
  color: white;
  line-height: 1.4;
`;

const VideoMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;
  color: #999;
`;

const VideoViews = styled.span``;

const VideoTime = styled.span``;

const VideoActions = styled.div`
  display: flex;
  justify-content: space-around;
  padding: 15px;
  border-top: 1px solid #333;
  background: #0f0f0f;
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  padding: 10px;
  border-radius: 8px;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: scale(1.05);
  }
`;

const ActionIcon = styled.span`
  font-size: 1.5rem;
`;

const ActionCount = styled.span`
  font-size: 0.8rem;
  font-weight: 600;
`;



const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: #000;
  color: white;
`;

const LoadingSpinner = styled.div`
  font-size: 4rem;
  margin-bottom: 20px;
  animation: spin 2s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const LoadingText = styled.p`
  font-size: 1.2rem;
  color: #999;
`;

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: #000;
  color: white;
`;

const ErrorIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 20px;
`;

const ErrorText = styled.p`
  font-size: 1.2rem;
  color: #ff6b6b;
  text-align: center;
  max-width: 400px;
`;

const EmptyContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: #000;
  color: white;
`;

const EmptyIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 20px;
`;

const EmptyTitle = styled.h2`
  font-size: 2rem;
  margin: 0 0 10px 0;
`;

const EmptyText = styled.p`
  font-size: 1.1rem;
  color: #999;
  text-align: center;
`;

export default VideoCards;
