// অ্যাডমিন ড্যাশবোর্ড কম্পোনেন্ট - ভিডিও ম্যানেজমেন্ট এর জন্য
// Admin Dashboard Component - For video management

import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchVideos, fetchProcessingJobs } from '../store/slices/videoSlice';
import VideoUploader from './VideoUploader';
import VideoLibrary from './VideoLibrary';
import ProcessingStatus from './ProcessingStatus';
import VideoConversion from './VideoConversion';

const AdminDashboard = ({ onLogout }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { videos, processingJobs } = useSelector(state => state.video);

  useEffect(() => {
    // Load videos and processing jobs
    dispatch(fetchVideos());
    dispatch(fetchProcessingJobs());
  }, [dispatch]);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('isAuthenticated');
    onLogout(false);
    navigate('/');
  };

  return (
    <DashboardContainer>
      <DashboardHeader>
        <HeaderContent>
          <HeaderTitle>🔐 অ্যাডমিন ড্যাশবোর্ড</HeaderTitle>
          <HeaderSubtitle>ভিডিও স্ট্রিমিং অ্যাপ ম্যানেজমেন্ট</HeaderSubtitle>
        </HeaderContent>
        <HeaderActions>
          <LogoutButton onClick={handleLogout}>
            🚪 লগআউট
          </LogoutButton>
        </HeaderActions>
      </DashboardHeader>

      <DashboardContent>
        <DashboardGrid>
          <DashboardCard>
            <CardHeader>
              <CardIcon>📊</CardIcon>
              <CardTitle>স্ট্যাটিসটিক্স</CardTitle>
            </CardHeader>
            <CardContent>
              <StatItem>
                <StatLabel>মোট ভিডিও:</StatLabel>
                <StatValue>{videos?.length || 0}</StatValue>
              </StatItem>
              <StatItem>
                <StatLabel>প্রসেসিং জব:</StatLabel>
                <StatValue>{processingJobs?.length || 0}</StatValue>
              </StatItem>
              <StatItem>
                <StatLabel>সক্রিয় জব:</StatLabel>
                <StatValue>
                  {processingJobs?.filter(job => job.status === 'processing').length || 0}
                </StatValue>
              </StatItem>
            </CardContent>
          </DashboardCard>

          <DashboardCard>
            <CardHeader>
              <CardIcon>🎬</CardIcon>
              <CardTitle>ভিডিও আপলোড</CardTitle>
            </CardHeader>
            <CardContent>
              <VideoUploader />
            </CardContent>
          </DashboardCard>

          <DashboardCard fullWidth>
            <CardHeader>
              <CardIcon>📚</CardIcon>
              <CardTitle>ভিডিও লাইব্রেরি</CardTitle>
            </CardHeader>
            <CardContent>
              <VideoLibrary />
            </CardContent>
          </DashboardCard>

          <DashboardCard fullWidth>
            <CardHeader>
              <CardIcon>⚙️</CardIcon>
              <CardTitle>প্রসেসিং স্ট্যাটাস</CardTitle>
            </CardHeader>
            <CardContent>
              <ProcessingStatus />
            </CardContent>
          </DashboardCard>

          <DashboardCard fullWidth>
            <CardHeader>
              <CardIcon>🔄</CardIcon>
              <CardTitle>ভিডিও কনভার্শন</CardTitle>
            </CardHeader>
            <CardContent>
              <VideoConversion />
            </CardContent>
          </DashboardCard>
        </DashboardGrid>
      </DashboardContent>
    </DashboardContainer>
  );
};

// স্টাইলড কম্পোনেন্টস
// Styled Components

const DashboardContainer = styled.div`
  min-height: 100vh;
  background: #f5f7fa;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
`;

const DashboardHeader = styled.header`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
`;

const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const HeaderTitle = styled.h1`
  font-size: 2.5rem;
  margin: 0;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
`;

const HeaderSubtitle = styled.p`
  font-size: 1.1rem;
  margin: 0;
  opacity: 0.9;
`;

const HeaderActions = styled.div`
  margin-top: 20px;
`;

const LogoutButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    border-color: rgba(255, 255, 255, 0.5);
  }
`;

const DashboardContent = styled.main`
  max-width: 1200px;
  margin: 0 auto;
  padding: 30px 20px;
`;

const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
`;

const DashboardCard = styled.div`
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  grid-column: ${props => props.fullWidth ? '1 / -1' : 'auto'};
`;

const CardHeader = styled.div`
  background: linear-gradient(45deg, #667eea, #764ba2);
  color: white;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 15px;
`;

const CardIcon = styled.div`
  font-size: 2rem;
`;

const CardTitle = styled.h2`
  font-size: 1.5rem;
  margin: 0;
`;

const CardContent = styled.div`
  padding: 20px;
`;

const StatItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 0;
  border-bottom: 1px solid #f0f0f0;

  &:last-child {
    border-bottom: none;
  }
`;

const StatLabel = styled.span`
  color: #666;
  font-weight: 500;
`;

const StatValue = styled.span`
  color: #333;
  font-weight: 700;
  font-size: 1.2rem;
`;

export default AdminDashboard;
