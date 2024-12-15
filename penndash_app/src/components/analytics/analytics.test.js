import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import analytics from './analytics';

describe('<analytics />', () => {
  test('it should mount', () => {
    render(<analytics />);

    const analytics = screen.getByTestId('analytics');

    expect(analytics).toBeInTheDocument();
  });
});