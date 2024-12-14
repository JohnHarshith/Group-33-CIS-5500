import React, { useState, useCallback } from 'react';
import { FcGoogle } from 'react-icons/fc';
import debounce from 'lodash.debounce'; // Ensure lodash.debounce is installed
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
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [confirmErrorMessage, setConfirmErrorMessage] = useState('');
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);

  const passwordCriteria = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setUsername('');
    setPassword('');
    setConfirmPassword('');
    setUsernameError('');
    setErrorMessage('');
    setConfirmErrorMessage('');
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);

    if (!passwordCriteria.test(value)) {
      setErrorMessage('Password must include 8 characters, 1 capital letter, 1 number, and 1 special character.');
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

  const checkUsername = async (username) => {
    if (!username) {
      setUsernameError('');
      return;
    }

    setIsCheckingUsername(true);
    try {
      const response = await fetch('http://localhost:8080/checkusername', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.exists) {
          setUsernameError('Username already exists.');
        } else {
          setUsernameError('');
        }
      } else {
        console.error('Error checking username');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsCheckingUsername(false);
    }
  };

  const debouncedCheckUsername = useCallback(debounce(checkUsername, 300), []);

  const handleUsernameChange = (e) => {
    const value = e.target.value;
    setUsername(value);
    debouncedCheckUsername(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isLogin && (usernameError || errorMessage || confirmErrorMessage)) {
      alert('Please resolve the errors before submitting.');
      return;
    }

    try {
      if (!isLogin) {
        // Handle registration
        const email = document.querySelector('input[placeholder="Email Address"]').value;

        const response = await fetch('http://localhost:8080/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, username, password }),
        });

        if (response.ok) {
          const data = await response.json();
          localStorage.setItem('username', username);
          localStorage.setItem('user_id', data.user.user_id);
          alert('Registration successful! Redirecting...');
          window.location.href = '/home';
        } else {
          const error = await response.json();
          alert(`Registration failed: ${error.error}`);
        }
      } else {
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
          {!isLogin && (
            <>
              <Input
                type="text"
                placeholder="Username"
                value={username}
                onChange={handleUsernameChange}
                required
              />
              {usernameError && (
                <p style={{ color: 'red', fontSize: '12px', marginTop: '5px' }}>{usernameError}</p>
              )}
            </>
          )}
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
            <p style={{ color: 'red', fontSize: '12px', marginTop: '5px' }}>{errorMessage}</p>
          )}
          {confirmErrorMessage && (
            <p style={{ color: 'red', fontSize: '12px', marginTop: '5px' }}>{confirmErrorMessage}</p>
          )}
          <SubmitButton
            type="submit"
            disabled={!isLogin && (usernameError || errorMessage || confirmErrorMessage)}
          >
            {isLogin ? 'Login' : 'Register'}
          </SubmitButton>
        </form>
        <IconButtonWrapper>
          <IconButton onClick={handleGoogleSignIn}>
            <FcGoogle size={20} /> Sign in with Google
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