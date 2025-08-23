// ইনলাইন ভিডিও প্লেয়ার কম্পোনেন্ট - TikTok/Instagram Reels স্টাইল
// Inline Video Player Component - TikTok/Instagram Reels Style

import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import envConfig from '../config/envConfig';

const InlineVideoPlayer = ({ videoId, onClose }) => {
  const videoRef = useRef(null);
  const { videos } = useSelector(state => state.video);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(envConfig.PLAYER.DEFAULT_VOLUME);
  const [isMuted, setIsMuted] = useState(true);
  const [showControls, setShowControls] = useState(false);
  const [buffering, setBuffering] = useState(false);

  const video = videos?.find(v => v.id === videoId);

  useEffect(() => {
    if (video && videoRef.current) {
      // Auto-play when video is selected
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          setIsPlaying(true);
        }).catch(error => {
          console.log('Auto-play prevented:', error);
          setIsPlaying(false);
        });
      }
    }
  }, [video]);

  useEffect(() => {
    if (!isPlaying) return;

    const timer = setTimeout(() => {
      setShowControls(false);
    }, envConfig.PLAYER.CONTROLS_TIMEOUT);

    return () => clearTimeout(timer);
  }, [isPlaying, showControls]);

  const togglePlay = async () => {
    if (videoRef.current) {
      try {
        if (isPlaying) {
          videoRef.current.pause();
          setIsPlaying(false);
        } else {
          const playPromise = videoRef.current.play();
          if (playPromise !== undefined) {
            await playPromise;
            setIsPlaying(true);
          }
        }
      } catch (error) {
        console.error('Play/Pause error:', error);
        setIsPlaying(false);
      }
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleSeek = (e) => {
    if (videoRef.current) {
      const rect = e.currentTarget.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const width = rect.width;
      const seekTime = (clickX / width) * duration;
      videoRef.current.currentTime = seekTime;
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
    if (newVolume === 0) {
      setIsMuted(true);
    } else {
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (!video) return null;

  return (
    <PlayerContainer>
      <VideoContainer
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => setShowControls(false)}
      >
        <StyledVideo
          ref={videoRef}
          crossOrigin="anonymous"
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onWaiting={() => setBuffering(true)}
          onCanPlay={() => setBuffering(false)}
          onLoadStart={() => setBuffering(true)}
          onLoadedData={() => setBuffering(false)}
          onError={(e) => {
            console.error('Video error:', e);
            setBuffering(false);
            setIsPlaying(false);
          }}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onEnded={() => setIsPlaying(false)}
          onClick={togglePlay}
          muted={isMuted}
          loop
        >
          <source src={envConfig.VIDEO_STREAM_URL(video.id)} type="video/mp4" />
          আপনার ব্রাউজার ভিডিও সাপোর্ট করে না।
        </StyledVideo>

        {buffering && (
          <BufferingOverlay>
            <BufferingSpinner>⏳</BufferingSpinner>
          </BufferingOverlay>
        )}

        <ControlsOverlay $show={showControls}>
          <ProgressBar onClick={handleSeek}>
            <ProgressFill
              style={{ width: `${(currentTime / duration) * 100}%` }}
            />
          </ProgressBar>

          <ControlsContainer>
            <LeftControls>
              <PlayButton onClick={togglePlay}>
                {isPlaying ? '⏸️' : '▶️'}
              </PlayButton>

              <TimeDisplay>
                {formatTime(currentTime)} / {formatTime(duration)}
              </TimeDisplay>
            </LeftControls>

            <RightControls>
              <VolumeControl>
                <VolumeButton onClick={toggleMute}>
                  {isMuted || volume === 0 ? '🔇' : '🔊'}
                </VolumeButton>
                <VolumeSlider
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                />
              </VolumeControl>

              <FullscreenButton onClick={() => videoRef.current?.requestFullscreen()}>
                ⛶
              </FullscreenButton>
            </RightControls>
          </ControlsContainer>
        </ControlsOverlay>

        <CloseButton onClick={onClose}>✕</CloseButton>
      </VideoContainer>
    </PlayerContainer>
  );
};



// স্টাইলড কম্পোনেন্টস
// Styled Components

const PlayerContainer = styled.div`
  width: 100%;
  height: 100%;
  background: #000;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
`;

const VideoContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  background: #000;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
`;

const StyledVideo = styled.video`
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
`;

const BufferingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
`;

const BufferingSpinner = styled.div`
  font-size: 3rem;
  animation: spin 2s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const ControlsOverlay = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
  padding: 20px;
  opacity: ${props => props.$show ? 1 : 0};
  transition: opacity 0.3s ease;
  pointer-events: ${props => props.$show ? 'auto' : 'none'};
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 6px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 3px;
  cursor: pointer;
  margin-bottom: 15px;
  position: relative;
`;

const ProgressFill = styled.div`
  height: 100%;
  background: linear-gradient(90deg, #667eea, #764ba2);
  border-radius: 3px;
  transition: width 0.1s ease;
`;

const ControlsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: white;
`;

const LeftControls = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

const PlayButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 2rem;
  cursor: pointer;
  padding: 5px;
  border-radius: 50%;
  transition: background 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

const TimeDisplay = styled.span`
  font-size: 0.9rem;
  font-weight: 500;
`;

const RightControls = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

const VolumeControl = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const VolumeButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 5px;
  border-radius: 50%;
  transition: background 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

const VolumeSlider = styled.input`
  width: 80px;
  height: 4px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 2px;
  outline: none;
  cursor: pointer;

  &::-webkit-slider-thumb {
    appearance: none;
    width: 16px;
    height: 16px;
    background: white;
    border-radius: 50%;
    cursor: pointer;
  }
`;

const FullscreenButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 5px;
  border-radius: 50%;
  transition: background 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 15px;
  right: 15px;
  background: rgba(0, 0, 0, 0.7);
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  transition: background 0.3s ease;
  z-index: 10;

  &:hover {
    background: rgba(0, 0, 0, 0.9);
  }
`;



export default InlineVideoPlayer;
