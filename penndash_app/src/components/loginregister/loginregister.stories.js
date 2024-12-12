import React, { useState } from 'react';
import LoginRegister from './loginregister';

export default {
  title: 'Components/LoginRegister',
  component: LoginRegister,
};

export const Default = () => <LoginRegister />;

// Simulating password validation error for Storybook
export const WithPasswordError = () => {
  const [password, setPassword] = useState('');

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const errorMessage =
    password.length < 8
      ? 'Password must be at least 8 characters long.'
      : '';

  return (
    <LoginRegister
      errorMessage={errorMessage}
      onPasswordChange={handlePasswordChange}
    />
  );
};
