// ভিডিও কনভার্শন কম্পোনেন্ট
// Video Conversion Component

import React, { useState } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { startVideoConversion } from '../store/slices/videoSlice';

// নোটিফিকেশন হুক ইমপোর্ট করা হচ্ছে
// Importing notification hook
import { useNotification } from './Notification';

const VideoConversion = () => {
  const dispatch = useDispatch();
  const { videos } = useSelector(state => state.video);

  // নোটিফিকেশন হুক ব্যবহার করছি
  // Using notification hook
  const { showSuccess, showError, showInfo } = useNotification();

  const [selectedVideo, setSelectedVideo] = useState('');
  const [selectedQuality, setSelectedQuality] = useState('720p');
  const [isConverting, setIsConverting] = useState(false);
  const [conversionMessage, setConversionMessage] = useState('');

  const handleConversion = async () => {
    if (!selectedVideo) {
      setConversionMessage('❌ কোন ভিডিও সিলেক্ট করা হয়নি');
      showError('ভিডিও সিলেক্ট করুন! ❌', 'কনভার্শনের জন্য একটি ভিডিও সিলেক্ট করুন।');
      return;
    }

    try {
      setIsConverting(true);
      setConversionMessage('🔄 কনভার্শন শুরু হচ্ছে...');

      // কনভার্শন শুরু নোটিফিকেশন দেখানো হচ্ছে
      // Showing conversion start notification
      showInfo('কনভার্শন শুরু হয়েছে! 🔄', `${selectedQuality} কোয়ালিটিতে ভিডিও কনভার্ট হচ্ছে...`);

      await dispatch(startVideoConversion({
        videoId: selectedVideo,
        quality: selectedQuality
      })).unwrap();

      setConversionMessage('✅ কনভার্শন সফলভাবে শুরু হয়েছে!');
      setSelectedVideo('');

      // সফল কনভার্শন নোটিফিকেশন দেখানো হচ্ছে
      // Showing successful conversion notification
      showSuccess('কনভার্শন সফল! 🎉', `${selectedQuality} কোয়ালিটিতে ভিডিও কনভার্শন শুরু হয়েছে। প্রসেসিং স্ট্যাটাস দেখুন।`);

      setTimeout(() => {
        setConversionMessage('');
      }, 3000);

    } catch (error) {
      setConversionMessage(`❌ কনভার্শনে সমস্যা হয়েছে: ${error}`);

      // এরর নোটিফিকেশন দেখানো হচ্ছে
      // Showing error notification
      showError('কনভার্শন ব্যর্থ! ❌', `কনভার্শনে সমস্যা হয়েছে: ${error}`);
    } finally {
      setIsConverting(false);
    }
  };

  if (!videos || videos.length === 0) {
    return null;
  }

  return (
    <ConversionContainer>
      <ConversionTitle>🔄 ভিডিও কনভার্শন</ConversionTitle>
      <ConversionSubtitle>আপনার ভিডিওগুলি বিভিন্ন কোয়ালিটিতে কনভার্ট করুন</ConversionSubtitle>

      <ConversionForm>
        <FormGroup>
          <FormLabel>ভিডিও সিলেক্ট করুন:</FormLabel>
          <FormSelect
            value={selectedVideo}
            onChange={(e) => setSelectedVideo(e.target.value)}
            disabled={isConverting}
          >
            <option value="">ভিডিও বেছে নিন</option>
            {videos.map((video) => (
              <option key={video.id} value={video.id}>
                {video.originalName} ({video.fileSize ? Math.round(video.fileSize / 1024 / 1024) + 'MB' : 'Unknown'})
              </option>
            ))}
          </FormSelect>
        </FormGroup>

        <FormGroup>
          <FormLabel>কোয়ালিটি সিলেক্ট করুন:</FormLabel>
          <QualityOptions>
            <QualityOption>
              <QualityRadio
                type="radio"
                id="480p"
                name="quality"
                value="480p"
                checked={selectedQuality === '480p'}
                onChange={(e) => setSelectedQuality(e.target.value)}
                disabled={isConverting}
              />
              <QualityLabel htmlFor="480p">
                <QualityIcon>📱</QualityIcon>
                <QualityInfo>
                  <QualityName>480p</QualityName>
                  <QualityDesc>দ্রুত স্ট্রিমিং, কম ডেটা</QualityDesc>
                </QualityInfo>
              </QualityLabel>
            </QualityOption>

            <QualityOption>
              <QualityRadio
                type="radio"
                id="720p"
                name="quality"
                value="720p"
                checked={selectedQuality === '720p'}
                onChange={(e) => setSelectedQuality(e.target.value)}
                disabled={isConverting}
              />
              <QualityLabel htmlFor="720p">
                <QualityIcon>💻</QualityIcon>
                <QualityInfo>
                  <QualityName>720p</QualityName>
                  <QualityDesc>ব্যালেন্সড কোয়ালিটি</QualityDesc>
                </QualityInfo>
              </QualityLabel>
            </QualityOption>

            <QualityOption>
              <QualityRadio
                type="radio"
                id="1080p"
                name="quality"
                value="1080p"
                checked={selectedQuality === '1080p'}
                onChange={(e) => setSelectedQuality(e.target.value)}
                disabled={isConverting}
              />
              <QualityLabel htmlFor="1080p">
                <QualityIcon>🖥️</QualityIcon>
                <QualityInfo>
                  <QualityName>1080p</QualityName>
                  <QualityDesc>উচ্চ কোয়ালিটি, বেশি ডেটা</QualityDesc>
                </QualityInfo>
              </QualityLabel>
            </QualityOption>
          </QualityOptions>
        </FormGroup>

        <ConversionButton
          onClick={handleConversion}
          disabled={!selectedVideo || isConverting}
        >
          {isConverting ? '🔄 কনভার্ট হচ্ছে...' : '🚀 কনভার্শন শুরু করুন'}
        </ConversionButton>

        {conversionMessage && (
          <ConversionMessage>
            {conversionMessage}
          </ConversionMessage>
        )}
      </ConversionForm>

      <ConversionInfo>
        <InfoTitle>💡 কনভার্শন সম্পর্কে:</InfoTitle>
        <InfoList>
          <InfoItem>• 480p: দ্রুত স্ট্রিমিং, কম ইন্টারনেট ব্যবহার</InfoItem>
          <InfoItem>• 720p: স্ট্যান্ডার্ড কোয়ালিটি, ব্যালেন্সড পারফরম্যান্স</InfoItem>
          <InfoItem>• 1080p: উচ্চ রেজোলিউশন, সেরা ভিজ্যুয়াল কোয়ালিটি</InfoItem>
          <InfoItem>• কনভার্শন ব্যাকগ্রাউন্ডে চলবে, আপনি অন্য কাজ করতে পারবেন</InfoItem>
          <InfoItem>• প্রসেসিং স্ট্যাটাস নিচে দেখতে পারবেন</InfoItem>
        </InfoList>
      </ConversionInfo>
    </ConversionContainer>
  );
};

const ConversionContainer = styled.div`
  background: white;
  border-radius: 15px;
  padding: 25px;
  margin-top: 30px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
`;

const ConversionTitle = styled.h2`
  color: #333;
  font-size: 24px;
  margin: 0 0 10px 0;
  font-weight: 700;
`;

const ConversionSubtitle = styled.p`
  color: #666;
  font-size: 16px;
  margin: 0 0 25px 0;
`;

const ConversionForm = styled.div`
  margin-bottom: 25px;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const FormLabel = styled.label`
  display: block;
  color: #333;
  font-weight: 600;
  font-size: 16px;
  margin-bottom: 10px;
`;

const FormSelect = styled.select`
  width: 100%;
  padding: 12px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 16px;
  background: white;
  color: #333;
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: #667eea;
  }
  
  &:disabled {
    background: #f5f5f5;
    cursor: not-allowed;
  }
`;

const QualityOptions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const QualityOption = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

const QualityRadio = styled.input`
  width: 20px;
  height: 20px;
  cursor: pointer;
  
  &:disabled {
    cursor: not-allowed;
  }
`;

const QualityLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 15px;
  cursor: pointer;
  padding: 15px;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  transition: all 0.3s ease;
  flex: 1;
  
  &:hover {
    border-color: #667eea;
    background: #f8f9ff;
  }
  
  ${QualityRadio}:checked + & {
    border-color: #667eea;
    background: #f0f2ff;
  }
`;

const QualityIcon = styled.div`
  font-size: 24px;
`;

const QualityInfo = styled.div`
  flex: 1;
`;

const QualityName = styled.div`
  font-weight: 600;
  color: #333;
  font-size: 16px;
  margin-bottom: 5px;
`;

const QualityDesc = styled.div`
  color: #666;
  font-size: 14px;
`;

const ConversionButton = styled.button`
  width: 100%;
  background: linear-gradient(45deg, #667eea, #764ba2);
  color: white;
  border: none;
  padding: 15px;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.3);
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const ConversionMessage = styled.div`
  margin-top: 15px;
  padding: 12px;
  border-radius: 8px;
  font-weight: 600;
  text-align: center;
  
  ${props => {
    if (props.children?.includes('❌')) {
      return `
        background: rgba(220, 53, 69, 0.1);
        color: #dc3545;
        border: 1px solid rgba(220, 53, 69, 0.3);
      `;
    } else if (props.children?.includes('✅')) {
      return `
        background: rgba(40, 167, 69, 0.1);
        color: #28a745;
        border: 1px solid rgba(40, 167, 69, 0.3);
      `;
    } else {
      return `
        background: rgba(23, 162, 184, 0.1);
        color: #17a2b8;
        border: 1px solid rgba(23, 162, 184, 0.3);
      `;
    }
  }}
`;

const ConversionInfo = styled.div`
  background: #f8f9ff;
  border-radius: 10px;
  padding: 20px;
  border-left: 4px solid #667eea;
`;

const InfoTitle = styled.h3`
  color: #333;
  font-size: 18px;
  margin: 0 0 15px 0;
  font-weight: 600;
`;

const InfoList = styled.ul`
  margin: 0;
  padding-left: 20px;
`;

const InfoItem = styled.li`
  color: #666;
  font-size: 14px;
  margin-bottom: 8px;
  line-height: 1.5;
`;

export default VideoConversion;
