import React, { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { BsMicrosoft } from 'react-icons/bs';
import {
  LoginRegisterWrapper,
  FormContainer,
  TabWrapper,
  Tab,
  Input,
  ForgotPassword,
  SubmitButton,
  SwitchText,
  IconButtonWrapper,
  IconButton,
} from './loginregister.styled';

const LoginRegister = ({ setUser }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [confirmErrorMessage, setConfirmErrorMessage] = useState('');

  const passwordCriteria = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setPassword('');
    setConfirmPassword('');
    setErrorMessage('');
    setConfirmErrorMessage('');
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);

    if (!passwordCriteria.test(value)) {
      setErrorMessage(
        'Password must be at least 8 characters long, include 1 capital letter, 1 number, and 1 special character.'
      );
    } else {
      setErrorMessage('');
    }
  };

  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value;
    setConfirmPassword(value);

    if (value !== password) {
      setConfirmErrorMessage('Passwords do not match.');
    } else {
      setConfirmErrorMessage('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!isLogin && (errorMessage || confirmErrorMessage)) {
      alert('Please fix the errors before submitting.');
      return;
    }
  
    try {
      if (!isLogin) {
        // Handle registration
        const username = document.querySelector('input[placeholder="Username"]').value;
        const email = document.querySelector('input[placeholder="Email Address"]').value;
  
        const response = await fetch('http://localhost:8080/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, username, password }),
        });
  
        if (response.ok) {
          const data = await response.json();
          localStorage.setItem('username', username); // Save new username
          localStorage.setItem('user_id', data.user.user_id); // Save user ID
          alert('Registration successful! Redirecting...');
          window.location.href = '/home';
        } else {
          const error = await response.json();
          alert(`Registration failed: ${error.error}`);
        }
      } else {
        // Login functionality not available; prompt the user
        alert('Login functionality is not implemented yet.');
      }
    } catch (err) {
      console.error('Error:', err);
      alert('An error occurred. Please try again.');
    }
  };  

  const handleGoogleSignIn = () => {
    window.location.href = 'http://localhost:3000/auth/google';
  };

  const handleMicrosoftSignIn = () => {
    window.location.href = 'http://localhost:3000/auth/microsoft';
  };

  return (
    <LoginRegisterWrapper>
      <FormContainer>
        <TabWrapper>
          <Tab active={isLogin} onClick={() => setIsLogin(true)}>
            Login
          </Tab>
          <Tab active={!isLogin} onClick={() => setIsLogin(false)}>
            Register
          </Tab>
        </TabWrapper>
        <form onSubmit={handleSubmit}>
          {!isLogin && <Input type="text" placeholder="Username" required />}
          <Input type="email" placeholder="Email Address" required />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={handlePasswordChange}
            required
          />
          {!isLogin && (
            <Input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              required
            />
          )}
          {errorMessage && (
            <p style={{ color: 'red', fontSize: '12px', marginTop: '5px' }}>
              {errorMessage}
            </p>
          )}
          {confirmErrorMessage && (
            <p style={{ color: 'red', fontSize: '12px', marginTop: '5px' }}>
              {confirmErrorMessage}
            </p>
          )}
          {isLogin && <ForgotPassword href="#">Forgot password?</ForgotPassword>}
          <SubmitButton type="submit" disabled={!isLogin && (errorMessage || confirmErrorMessage)}>
            {isLogin ? 'Login' : 'Register'}
          </SubmitButton>
        </form>
        <IconButtonWrapper>
          <IconButton onClick={handleGoogleSignIn}>
            <FcGoogle size={20} /> Sign in with Google
          </IconButton>
          <IconButton onClick={handleMicrosoftSignIn}>
            <BsMicrosoft size={20} /> Sign in with Microsoft
          </IconButton>
        </IconButtonWrapper>
        <SwitchText>
          {isLogin ? 'Not a member? ' : 'Already a member? '}
          <a onClick={toggleForm}>{isLogin ? 'Register now' : 'Login now'}</a>
        </SwitchText>
      </FormContainer>
    </LoginRegisterWrapper>
  );
};

export default LoginRegister;