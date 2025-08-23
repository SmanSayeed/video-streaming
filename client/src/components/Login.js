// লগইন কম্পোনেন্ট - ইউজার অথেনটিকেশন এর জন্য
// Login Component - For user authentication

import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Simple authentication (username: admin, password: password)
      if (username === 'admin' && password === 'password') {
        // Store authentication token
        localStorage.setItem('authToken', 'admin-token-123');
        localStorage.setItem('isAuthenticated', 'true');

        // Call parent onLogin function
        onLogin(true);

        // Navigate to admin dashboard
        navigate('/admin');
      } else {
        setError('ভুল ইউজারনেম বা পাসওয়ার্ড');
      }
    } catch (error) {
      setError('লগইনে সমস্যা হয়েছে');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LoginContainer>
      <LoginCard>
        <LoginHeader>
          <LoginIcon>🔐</LoginIcon>
          <LoginTitle>অ্যাডমিন লগইন</LoginTitle>
          <LoginSubtitle>ভিডিও স্ট্রিমিং অ্যাপ অ্যাডমিন প্যানেল</LoginSubtitle>
        </LoginHeader>

        <LoginForm onSubmit={handleSubmit}>
          <FormGroup>
            <FormLabel>ইউজারনেম</FormLabel>
            <FormInput
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="ইউজারনেম লিখুন"
              required
            />
          </FormGroup>

          <FormGroup>
            <FormLabel>পাসওয়ার্ড</FormLabel>
            <FormInput
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="পাসওয়ার্ড লিখুন"
              required
            />
          </FormGroup>

          {error && <ErrorMessage>{error}</ErrorMessage>}

          <LoginButton type="submit" disabled={isLoading}>
            {isLoading ? 'লগইন হচ্ছে...' : 'লগইন করুন'}
          </LoginButton>
        </LoginForm>

        <LoginInfo>
          <InfoText>ডেমো অ্যাকাউন্ট:</InfoText>
          <InfoText>ইউজারনেম: <strong>admin</strong></InfoText>
          <InfoText>পাসওয়ার্ড: <strong>password</strong></InfoText>
          <BackButton onClick={() => navigate('/')}>
            🏠 মূল পেজে ফিরে যান
          </BackButton>
        </LoginInfo>
      </LoginCard>
    </LoginContainer>
  );
};

// স্টাইলড কম্পোনেন্টস
// Styled Components

const LoginContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
`;

const LoginCard = styled.div`
  background: white;
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  text-align: center;
`;

const LoginHeader = styled.div`
  margin-bottom: 30px;
`;

const LoginIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 20px;
`;

const LoginTitle = styled.h1`
  font-size: 2rem;
  color: #333;
  margin: 0 0 10px 0;
`;

const LoginSubtitle = styled.p`
  color: #666;
  margin: 0;
`;

const LoginForm = styled.form`
  text-align: left;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const FormLabel = styled.label`
  display: block;
  margin-bottom: 8px;
  color: #333;
  font-weight: 600;
`;

const FormInput = styled.input`
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.3s ease;

  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

const ErrorMessage = styled.div`
  color: #dc3545;
  background: #f8d7da;
  border: 1px solid #f5c6cb;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 20px;
  text-align: center;
`;

const LoginButton = styled.button`
  width: 100%;
  background: linear-gradient(45deg, #667eea, #764ba2);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 14px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const LoginInfo = styled.div`
  margin-top: 30px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e9ecef;
`;

const InfoText = styled.p`
  margin: 5px 0;
  color: #666;
  font-size: 14px;
`;

const BackButton = styled.button`
  background: #6c757d;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 10px 20px;
  font-size: 14px;
  cursor: pointer;
  margin-top: 15px;
  transition: all 0.3s ease;

  &:hover {
    background: #5a6268;
    transform: translateY(-2px);
  }
`;

export default Login;
