import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import restaurantpage from './restaurantpage';

describe('<restaurantpage />', () => {
  test('it should mount', () => {
    render(<restaurantpage />);

    const restaurantpage = screen.getByTestId('restaurantpage');

    expect(restaurantpage).toBeInTheDocument();
  });
});