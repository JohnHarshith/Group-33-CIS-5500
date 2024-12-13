import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import logout from './logout';

describe('<logout />', () => {
  test('it should mount', () => {
    render(<logout />);

    const logout = screen.getByTestId('logout');

    expect(logout).toBeInTheDocument();
  });
});