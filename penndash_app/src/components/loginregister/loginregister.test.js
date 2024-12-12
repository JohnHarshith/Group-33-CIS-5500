import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import loginregister from './loginregister';

describe('<loginregister />', () => {
  test('it should mount', () => {
    render(<loginregister />);

    const loginregister = screen.getByTestId('loginregister');

    expect(loginregister).toBeInTheDocument();
  });
});