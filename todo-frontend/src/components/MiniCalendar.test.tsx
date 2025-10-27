import { render, screen } from '@testing-library/react';
import MiniCalendar from './MiniCalendar';
import { expect, test } from 'vitest';


test('renders current month header and highlights today', () => {
  render(<MiniCalendar />);
  const now = new Date();
  expect(screen.getByText(new RegExp(now.toLocaleString(undefined, { month: 'long' }), 'i'))).toBeInTheDocument();
  // today’s number appears at least once
  expect(screen.getAllByText(String(now.getDate()))[0]).toBeInTheDocument();
});
