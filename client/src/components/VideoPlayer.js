// ভিডিও প্লেয়ার কম্পোনেন্ট - বিল্ট-ইন স্ট্রিমিং প্লেয়ার
// Video Player Component - Built-in streaming player

import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';

const VideoPlayer = ({ video, onClose }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [buffering, setBuffering] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);

  useEffect(() => {
    if (video) {
      setShowControls(true);
      const timer = setTimeout(() => {
        setShowControls(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [video]);

  useEffect(() => {
    if (!isPlaying) return;

    const timer = setTimeout(() => {
      setShowControls(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, [isPlaying, showControls]);

  const togglePlay = async () => {
    if (videoRef.current) {
      try {
        if (isPlaying) {
          videoRef.current.pause();
          setIsPlaying(false);
        } else {
          if (videoRef.current.readyState < 2) {
            videoRef.current.load();
          }
          
          const playPromise = videoRef.current.play();
          if (playPromise !== undefined) {
            await playPromise;
            setIsPlaying(true);
          }
        }
      } catch (error) {
        console.error('Play/Pause error:', error);
        setIsPlaying(false);
        setBuffering(false);
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

  const changePlaybackRate = (rate) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = rate;
      setPlaybackRate(rate);
    }
  };

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        videoRef.current.requestFullscreen();
      }
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (!video) return null;

  return (
    <PlayerOverlay onClick={onClose}>
      <PlayerContainer onClick={(e) => e.stopPropagation()}>
        <VideoContainer>
          <StyledVideo
            ref={videoRef}
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
              if (e.target.error) {
                console.error('Video error details:', e.target.error);
              }
            }}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onEnded={() => setIsPlaying(false)}
            onClick={togglePlay}
          >
            <source src={`/api/stream/${video.id}`} type="video/mp4" />
            আপনার ব্রাউজার ভিডিও সাপোর্ট করে না।
          </StyledVideo>

          {buffering && (
            <BufferingOverlay>
              <BufferingSpinner>⏳</BufferingSpinner>
              <BufferingText>লোড হচ্ছে...</BufferingText>
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
                
                <PlaybackRateControl>
                  <PlaybackRateButton
                    onClick={() => changePlaybackRate(playbackRate === 1 ? 1.5 : 1)}
                  >
                    {playbackRate}x
                  </PlaybackRateButton>
                </PlaybackRateControl>
                
                <FullscreenButton onClick={toggleFullscreen}>
                  ⛶
                </FullscreenButton>
              </RightControls>
            </ControlsContainer>
          </ControlsOverlay>
        </VideoContainer>

        <VideoInfo>
          <VideoTitle>{video.originalName}</VideoTitle>
          <CloseButton onClick={onClose}>✕</CloseButton>
        </VideoInfo>
      </PlayerContainer>
    </PlayerOverlay>
  );
};

// স্টাইলড কম্পোনেন্টস
// Styled Components

const PlayerOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.95);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
`;

const PlayerContainer = styled.div`
  background: #1a1a1a;
  border-radius: 16px;
  max-width: 90vw;
  max-height: 90vh;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
`;

const VideoContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  background: #000;
  border-radius: 8px;
  overflow: hidden;
  aspect-ratio: 16/9;
  cursor: pointer;
`;

const StyledVideo = styled.video`
  width: 100%;
  height: 100%;
  display: block;
  object-fit: contain;
`;

const BufferingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
`;

const BufferingSpinner = styled.div`
  font-size: 3rem;
  margin-bottom: 15px;
  animation: spin 2s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const BufferingText = styled.p`
  font-size: 1.1rem;
  margin: 0;
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

const PlaybackRateControl = styled.div`
  display: flex;
  align-items: center;
`;

const PlaybackRateButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
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

const VideoInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: #2a2a2a;
  border-top: 1px solid #333;
`;

const VideoTitle = styled.h3`
  color: white;
  margin: 0;
  font-size: 1.2rem;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  transition: background 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

export default VideoPlayer;
