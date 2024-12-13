import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import home from './home';

describe('<home />', () => {
  test('it should mount', () => {
    render(<home />);

    const home = screen.getByTestId('home');

    expect(home).toBeInTheDocument();
  });
});