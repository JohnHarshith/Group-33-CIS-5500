import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import bookmarks from './bookmarks';

describe('<bookmarks />', () => {
  test('it should mount', () => {
    render(<bookmarks />);

    const bookmarks = screen.getByTestId('bookmarks');

    expect(bookmarks).toBeInTheDocument();
  });
});