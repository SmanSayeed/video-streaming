// এরর বাউন্ডারি কম্পোনেন্ট
// Error Boundary Component

import React from 'react';
import styled from 'styled-components';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });

    // এরর লগ করছি
    console.error('Error Boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <ErrorContainer>
          <ErrorIcon>💥</ErrorIcon>
          <ErrorTitle>ওহো! কিছু সমস্যা হয়েছে</ErrorTitle>
          <ErrorMessage>
            অ্যাপ্লিকেশনে একটি অপ্রত্যাশিত সমস্যা দেখা দিয়েছে।
            দয়া করে পেজটি রিফ্রেশ করুন বা কিছুক্ষণ পর আবার চেষ্টা করুন।
          </ErrorMessage>

          <ErrorActions>
            <RetryButton onClick={() => window.location.reload()}>
              🔄 পেজ রিফ্রেশ করুন
            </RetryButton>

            <HomeButton onClick={() => window.location.href = '/'}>
              🏠 হোমে ফিরে যান
            </HomeButton>
          </ErrorActions>

          {process.env.NODE_ENV === 'development' && (
            <ErrorDetails>
              <ErrorDetailsTitle>ডেভেলপার এর জন্য ডিটেইলস:</ErrorDetailsTitle>
              <ErrorDetailsText>
                <strong>Error:</strong> {this.state.error?.toString()}
              </ErrorDetailsText>
              <ErrorDetailsText>
                <strong>Stack:</strong> {this.state.errorInfo?.componentStack}
              </ErrorDetailsText>
            </ErrorDetails>
          )}
        </ErrorContainer>
      );
    }

    return this.props.children;
  }
}

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 40px;
  text-align: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
`;

const ErrorIcon = styled.div`
  font-size: 80px;
  margin-bottom: 20px;
  animation: bounce 2s infinite;
  
  @keyframes bounce {
    0%, 20%, 50%, 80%, 100% {
      transform: translateY(0);
    }
    40% {
      transform: translateY(-20px);
    }
    60% {
      transform: translateY(-10px);
    }
  }
`;

const ErrorTitle = styled.h1`
  font-size: 32px;
  margin: 0 0 20px 0;
  font-weight: 700;
`;

const ErrorMessage = styled.p`
  font-size: 18px;
  margin: 0 0 30px 0;
  max-width: 600px;
  line-height: 1.6;
  opacity: 0.9;
`;

const ErrorActions = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 40px;
  
  @media (max-width: 600px) {
    flex-direction: column;
    gap: 15px;
  }
`;

const RetryButton = styled.button`
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
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(76, 175, 80, 0.4);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const HomeButton = styled.button`
  background: linear-gradient(45deg, #ff6b6b, #ee5a52);
  color: white;
  border: none;
  padding: 15px 30px;
  border-radius: 25px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 5px 15px rgba(255, 107, 107, 0.3);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(255, 107, 107, 0.4);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const ErrorDetails = styled.div`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: 20px;
  max-width: 800px;
  text-align: left;
  backdrop-filter: blur(10px);
`;

const ErrorDetailsTitle = styled.h3`
  font-size: 18px;
  margin: 0 0 15px 0;
  font-weight: 600;
  color: #ffd700;
`;

const ErrorDetailsText = styled.div`
  font-size: 14px;
  margin-bottom: 10px;
  font-family: monospace;
  background: rgba(0, 0, 0, 0.3);
  padding: 10px;
  border-radius: 5px;
  word-break: break-all;
  line-height: 1.4;
`;

export default ErrorBoundary;
