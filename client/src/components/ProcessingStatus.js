// ভিডিও প্রসেসিং স্ট্যাটাস কম্পোনেন্ট
// Video Processing Status Component

import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProcessingJobs, checkProcessingStatus } from '../store/slices/videoSlice';

const ProcessingStatus = () => {
  const dispatch = useDispatch();
  const { processingJobs, jobStatus, loadingError } = useSelector(state => state.video);
  
  useEffect(() => {
    dispatch(fetchProcessingJobs());
  }, [dispatch]);

  useEffect(() => {
    if (!processingJobs || processingJobs.length === 0) return;
    
    // প্রতি 5 সেকেন্ডে স্ট্যাটাস চেক করছি
    const interval = setInterval(() => {
      processingJobs.forEach(job => {
        if (job.status === 'queued' || job.status === 'processing') {
          dispatch(checkProcessingStatus(job.id));
        }
      });
    }, 5000);
    
    return () => clearInterval(interval);
  }, [dispatch, processingJobs]);
  
  if (jobStatus === 'loading') {
    return (
      <StatusContainer>
        <StatusTitle>⚙️ প্রসেসিং স্ট্যাটাস</StatusTitle>
        <LoadingMessage>🔄 প্রসেসিং জবগুলি লোড হচ্ছে...</LoadingMessage>
      </StatusContainer>
    );
  }
  
  if (loadingError) {
    return (
      <StatusContainer>
        <StatusTitle>⚙️ প্রসেসিং স্ট্যাটাস</StatusTitle>
        <ErrorMessage>❌ প্রসেসিং জব লোড করতে সমস্যা হয়েছে: {loadingError}</ErrorMessage>
      </StatusContainer>
    );
  }
  
  if (!processingJobs || processingJobs.length === 0) {
    return (
      <StatusContainer>
        <StatusTitle>⚙️ প্রসেসিং স্ট্যাটাস</StatusTitle>
        <EmptyMessage>📭 কোন প্রসেসিং জব নেই</EmptyMessage>
      </StatusContainer>
    );
  }
  
  const getStatusIcon = (status) => {
    switch (status) {
      case 'queued': return '⏳';
      case 'processing': return '🔄';
      case 'completed': return '✅';
      case 'failed': return '❌';
      case 'cancelled': return '🚫';
      default: return '❓';
    }
  };
  
  // স্ট্যাটাস কালার ফাংশন (ভবিষ্যতের জন্য)
  // Status color function (for future use)
  // const getStatusColor = (status) => {
  //   switch (status) {
  //     case 'queued': return '#ffc107';
  //     case 'processing': return '#17a2b8';
  //     case 'completed': return '#28a745';
  //     case 'failed': return '#dc3545';
  //     case 'cancelled': return '#6c757d';
  //     default: return '#6c757d';
  //   }
  // };
  
  return (
    <StatusContainer>
      <StatusTitle>⚙️ প্রসেসিং স্ট্যাটাস</StatusTitle>
      <JobList>
        {processingJobs.map((job) => (
          <JobCard key={job.id} $status={job.status}>
            <JobHeader>
              <JobIcon>{getStatusIcon(job.status)}</JobIcon>
              <JobInfo>
                <JobId>জব #{job.id}</JobId>
                <JobVideo>ভিডিও: {job.videoId}</JobVideo>
              </JobInfo>
              <JobStatus $status={job.status}>
                {job.status === 'queued' && 'সারিতে'}
                {job.status === 'processing' && 'প্রসেসিং'}
                {job.status === 'completed' && 'সম্পূর্ণ'}
                {job.status === 'failed' && 'ব্যর্থ'}
                {job.status === 'cancelled' && 'বাতিল'}
              </JobStatus>
            </JobHeader>
            
            <JobDetails>
              <DetailItem>
                <DetailLabel>কোয়ালিটি:</DetailLabel>
                <DetailValue>{job.quality || '720p'}</DetailValue>
              </DetailItem>
              
              <DetailItem>
                <DetailLabel>মেসেজ:</DetailLabel>
                <DetailValue>{job.message}</DetailValue>
              </DetailItem>
              
              {job.progress !== undefined && (
                <DetailItem>
                  <DetailLabel>প্রোগ্রেস:</DetailLabel>
                  <ProgressBar>
                    <ProgressFill $progress={job.progress} />
                  </ProgressBar>
                  <ProgressText>{job.progress}%</ProgressText>
                </DetailItem>
              )}
              
              <DetailItem>
                <DetailLabel>শুরুর সময়:</DetailLabel>
                <DetailValue>
                  {new Date(job.startTime).toLocaleString('bn-BD')}
                </DetailValue>
              </DetailItem>
              
              {job.endTime && (
                <DetailItem>
                  <DetailLabel>শেষের সময়:</DetailLabel>
                  <DetailValue>
                    {new Date(job.endTime).toLocaleString('bn-BD')}
                  </DetailValue>
                </DetailItem>
              )}
              
              {job.error && (
                <DetailItem>
                  <DetailLabel>এরর:</DetailLabel>
                  <ErrorValue>{job.error}</ErrorValue>
                </DetailItem>
              )}
            </JobDetails>
          </JobCard>
        ))}
      </JobList>
    </StatusContainer>
  );
};

const StatusContainer = styled.div`
  background: white;
  border-radius: 15px;
  padding: 25px;
  margin-top: 30px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
`;

const StatusTitle = styled.h2`
  color: #333;
  font-size: 24px;
  margin: 0 0 25px 0;
  font-weight: 700;
`;

const JobList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const JobCard = styled.div`
  border: 2px solid ${props => getStatusColor(props.$status)};
  border-radius: 10px;
  padding: 20px;
  background: ${props => `${getStatusColor(props.$status)}10`};
`;

const JobHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 15px;
`;

const JobIcon = styled.div`
  font-size: 24px;
`;

const JobInfo = styled.div`
  flex: 1;
`;

const JobId = styled.div`
  font-weight: 600;
  color: #333;
  font-size: 14px;
`;

const JobVideo = styled.div`
  color: #666;
  font-size: 12px;
  margin-top: 2px;
`;

const JobStatus = styled.div`
  padding: 6px 12px;
  border-radius: 15px;
  font-size: 12px;
  font-weight: 600;
  background: ${props => getStatusColor(props.$status)};
  color: white;
`;

const JobDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const DetailItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const DetailLabel = styled.span`
  color: #666;
  font-size: 14px;
  font-weight: 600;
  min-width: 100px;
`;

const DetailValue = styled.span`
  color: #333;
  font-size: 14px;
`;

const ProgressBar = styled.div`
  flex: 1;
  height: 8px;
  background: #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
`;

const ProgressFill = styled.div`
  height: 100%;
  background: linear-gradient(90deg, #667eea, #764ba2);
  width: ${props => props.$progress}%;
  transition: width 0.3s ease;
`;

const ProgressText = styled.span`
  color: #333;
  font-size: 12px;
  font-weight: 600;
  min-width: 40px;
  text-align: right;
`;

const ErrorValue = styled.span`
  color: #dc3545;
  font-size: 14px;
  font-style: italic;
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
  font-size: 16px;
`;

const getStatusColor = (status) => {
  switch (status) {
    case 'queued': return '#ffc107';
    case 'processing': return '#17a2b8';
    case 'completed': return '#28a745';
    case 'failed': return '#dc3545';
    case 'cancelled': return '#6c757d';
    default: return '#6c757d';
  }
};

export default ProcessingStatus;
