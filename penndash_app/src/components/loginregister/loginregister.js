import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import {
  LoginRegisterWrapper,
  FormContainer,
  TabWrapper,
  Tab,
  InputWrapper,
  Input,
  EyeIcon,
  SubmitButton,
  SwitchText,
  IconButtonWrapper,
  IconButton,
} from './loginregister.styled';

const LoginRegister = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const passwordCriteria = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setEmail('');
    setUsername('');
    setPassword('');
    setConfirmPassword('');
    setErrorMessage('');
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);

    if (!passwordCriteria.test(value) && !isLogin) {
      setErrorMessage('Password must include 8 characters, 1 capital letter, 1 number, and 1 special character.');
    } else {
      setErrorMessage('');
    }
  };

  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value;
    setConfirmPassword(value);

    if (value !== password) {
      setErrorMessage('Passwords do not match.');
    } else {
      setErrorMessage('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isLogin && password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    const url = isLogin ? 'http://localhost:8080/login' : 'http://localhost:8080/register';
    const body = isLogin ? { email, password } : { email, username, password };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        const data = await response.json();

        // Store user_id and username in localStorage
        localStorage.setItem('user_id', data.user.user_id || '');
        localStorage.setItem('username', data.user.username || '');

        alert(isLogin ? 'Login successful!' : 'Registration successful!');
        navigate('/home'); // Redirect to home
      } else {
        const error = await response.json();
        setErrorMessage(error.error || 'An error occurred. Please try again.');
      }
    } catch (err) {
      console.error('Error:', err);
      setErrorMessage('An error occurred. Please try again.');
    }
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
          <InputWrapper>
            <Input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </InputWrapper>
          {!isLogin && (
            <InputWrapper>
              <Input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </InputWrapper>
          )}
          <InputWrapper>
            <Input
              type={passwordVisible ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={handlePasswordChange}
              required
            />
            <EyeIcon onClick={() => setPasswordVisible(!passwordVisible)}>
              {passwordVisible ? '🙈' : '👁️'}
            </EyeIcon>
          </InputWrapper>
          {!isLogin && (
            <InputWrapper>
              <Input
                type={confirmPasswordVisible ? 'text' : 'password'}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                required
              />
              <EyeIcon onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}>
                {confirmPasswordVisible ? '🙈' : '👁️'}
              </EyeIcon>
            </InputWrapper>
          )}
          {errorMessage && (
            <p style={{ color: 'red', fontSize: '12px', marginTop: '5px' }}>{errorMessage}</p>
          )}
          <SubmitButton type="submit">{isLogin ? 'Login' : 'Register'}</SubmitButton>
        </form>
        <SwitchText>
          {isLogin ? 'Not a member? ' : 'Already a member? '}
          <button
            type="button"
            onClick={toggleForm}
            style={{
              background: 'none',
              border: 'none',
              color: 'blue',
              textDecoration: 'underline',
              cursor: 'pointer',
            }}
          >
            {isLogin ? 'Register now' : 'Login now'}
          </button>
        </SwitchText>
      </FormContainer>
    </LoginRegisterWrapper>
  );
};

export default LoginRegister;