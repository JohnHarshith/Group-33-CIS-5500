import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import favorites from './favorites';

describe('<favorites />', () => {
  test('it should mount', () => {
    render(<favorites />);

    const favorites = screen.getByTestId('favorites');

    expect(favorites).toBeInTheDocument();
  });
});