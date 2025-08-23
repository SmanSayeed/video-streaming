// লোডিং স্পিনার কম্পোনেন্ট
// Loading Spinner Component

import React from 'react';
import styled, { keyframes } from 'styled-components';

const LoadingSpinner = ({ size = 'medium', text = 'লোড হচ্ছে...', fullScreen = false }) => {
  if (fullScreen) {
    return (
      <FullScreenContainer>
        <SpinnerContainer size={size}>
          <Spinner size={size} />
          {text && <SpinnerText>{text}</SpinnerText>}
        </SpinnerContainer>
      </FullScreenContainer>
    );
  }
  
  return (
    <SpinnerContainer size={size}>
      <Spinner size={size} />
      {text && <SpinnerText>{text}</SpinnerText>}
    </SpinnerContainer>
  );
};

// স্পিনার অ্যানিমেশন
// Spinner animation
const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
`;

const SpinnerContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${props => props.size === 'small' ? '8px' : props.size === 'large' ? '20px' : '15px'};
`;

const Spinner = styled.div`
  width: ${props => {
    switch (props.size) {
      case 'small': return '20px';
      case 'large': return '60px';
      default: return '40px';
    }
  }};
  height: ${props => {
    switch (props.size) {
      case 'small': return '20px';
      case 'large': return '60px';
      default: return '40px';
    }
  }};
  border: 3px solid #f3f3f3;
  border-top: 3px solid #667eea;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
  
  ${props => props.size === 'large' && `
    border-width: 4px;
    border-top-color: #764ba2;
  `}
`;

const SpinnerText = styled.div`
  color: #666;
  font-size: ${props => {
    switch (props.size) {
      case 'small': return '12px';
      case 'large': return '18px';
      default: return '14px';
    }
  }};
  font-weight: 600;
  text-align: center;
  animation: ${pulse} 2s ease-in-out infinite;
`;

const FullScreenContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.95);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  backdrop-filter: blur(5px);
`;

// বিভিন্ন সাইজের স্পিনার
// Different sized spinners
export const SmallSpinner = () => <LoadingSpinner size="small" />;
export const MediumSpinner = () => <LoadingSpinner size="medium" />;
export const LargeSpinner = () => <LoadingSpinner size="large" />;
export const FullScreenSpinner = ({ text }) => <LoadingSpinner size="large" text={text} fullScreen />;

export default LoadingSpinner;
