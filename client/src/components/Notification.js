// নোটিফিকেশন কম্পোনেন্ট
// Notification Component

import React, { useState, useEffect, useCallback } from 'react';
import styled, { keyframes } from 'styled-components';

const Notification = ({
  type = 'info',
  title,
  message,
  duration = 5000,
  onClose,
  show = true
}) => {
  const [isVisible, setIsVisible] = useState(show);
  const [isExiting, setIsExiting] = useState(false);

  const handleClose = useCallback(() => {
    setIsExiting(true);
    setTimeout(() => {
      setIsVisible(false);
      if (onClose) onClose();
    }, 300);
  }, [onClose]);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, handleClose]);

  if (!isVisible) return null;

  const getIcon = () => {
    switch (type) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'warning': return '⚠️';
      case 'info': return 'ℹ️';
      default: return '💬';
    }
  };

  const getColor = () => {
    switch (type) {
      case 'success': return '#28a745';
      case 'error': return '#dc3545';
      case 'warning': return '#ffc107';
      case 'info': return '#17a2b8';
      default: return '#6c757d';
    }
  };

  return (
    <NotificationContainer
      type={type}
      isExiting={isExiting}
      color={getColor()}
    >
      <NotificationIcon>{getIcon()}</NotificationIcon>

      <NotificationContent>
        {title && <NotificationTitle>{title}</NotificationTitle>}
        {message && <NotificationMessage>{message}</NotificationMessage>}
      </NotificationContent>

      <CloseButton onClick={handleClose}>×</CloseButton>

      {duration > 0 && (
        <ProgressBar>
          <ProgressFill duration={duration} />
        </ProgressBar>
      )}
    </NotificationContainer>
  );
};

// নোটিফিকেশন সিস্টেম
// Notification System
export const NotificationSystem = ({ notifications, removeNotification }) => {
  return (
    <NotificationSystemContainer>
      {notifications.map((notification) => (
        <Notification
          key={notification.id}
          type={notification.type}
          title={notification.title}
          message={notification.message}
          duration={notification.duration}
          onClose={() => removeNotification(notification.id)}
        />
      ))}
    </NotificationSystemContainer>
  );
};

// অ্যানিমেশন
// Animations
const slideIn = keyframes`
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const slideOut = keyframes`
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
`;

const progress = keyframes`
  from {
    width: 100%;
  }
  to {
    width: 0%;
  }
`;

const NotificationSystemContainer = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 10000;
  display: flex;
  flex-direction: column;
  gap: 15px;
  max-width: 400px;
  
  @media (max-width: 600px) {
    left: 20px;
    right: 20px;
    max-width: none;
  }
`;

const NotificationContainer = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 15px;
  background: white;
  border-left: 4px solid ${props => props.color};
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  position: relative;
  overflow: hidden;
  animation: ${props => props.isExiting ? slideOut : slideIn} 0.3s ease-in-out;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.2);
  }
  
  transition: all 0.3s ease;
`;

const NotificationIcon = styled.div`
  font-size: 24px;
  flex-shrink: 0;
`;

const NotificationContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const NotificationTitle = styled.div`
  font-weight: 600;
  color: #333;
  font-size: 16px;
  margin-bottom: 5px;
  line-height: 1.3;
`;

const NotificationMessage = styled.div`
  color: #666;
  font-size: 14px;
  line-height: 1.4;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: #999;
  font-size: 24px;
  cursor: pointer;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s ease;
  flex-shrink: 0;
  
  &:hover {
    background: #f0f0f0;
    color: #666;
  }
  
  &:active {
    transform: scale(0.9);
  }
`;

const ProgressBar = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: #f0f0f0;
  overflow: hidden;
`;

const ProgressFill = styled.div`
  height: 100%;
  background: ${props => props.color || '#667eea'};
  animation: ${progress} ${props => props.duration}ms linear forwards;
`;

// হুক ফর নোটিফিকেশন
// Hook for notifications
export const useNotification = () => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = (notification) => {
    const id = Date.now() + Math.random();
    const newNotification = { id, ...notification };
    setNotifications(prev => [...prev, newNotification]);

    return id;
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const showSuccess = (title, message, duration = 5000) => {
    return addNotification({ type: 'success', title, message, duration });
  };

  const showError = (title, message, duration = 7000) => {
    return addNotification({ type: 'error', title, message, duration });
  };

  const showWarning = (title, message, duration = 5000) => {
    return addNotification({ type: 'warning', title, message, duration });
  };

  const showInfo = (title, message, duration = 5000) => {
    return addNotification({ type: 'info', title, message, duration });
  };

  return {
    notifications,
    addNotification,
    removeNotification,
    showSuccess,
    showError,
    showWarning,
    showInfo
  };
};

export default Notification;
