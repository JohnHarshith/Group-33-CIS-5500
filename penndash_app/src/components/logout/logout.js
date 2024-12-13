import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
   LogoutWrapper,
   Message,
   LoginButton
 } from './logout.styled';

const Logout = () => {
  const navigate = useNavigate();

  const handleLoginRedirect = () => {
    navigate('/');
  };

  return (
    <LogoutWrapper>
      <Message>Successfully Logged Out</Message>
      <LoginButton onClick={handleLoginRedirect}>Login</LoginButton>
    </LogoutWrapper>
  );
};

export default Logout;
