import { render, screen, waitFor } from '@testing-library/react';
import user from '@testing-library/user-event';
import App from './App';
import { expect, beforeAll, test } from 'vitest';


beforeAll(() => {
  // ensure axios/fetch baseURL points to http://localhost:8080/api
  (import.meta as any).env = { VITE_API_BASE_URL: 'http://localhost:8080/api' };
});

test('loads 5 tasks, adds one, marks one done', async () => {
  render(<App />);

  await waitFor(() =>
    expect(screen.getByRole('heading', { level: 2, name: /tasks to be done/i }))
      .toBeInTheDocument()
  );
  
  expect(screen.getAllByRole('button', { name: /done/i }).length).toBe(5);

  await user.type(screen.getByPlaceholderText(/title/i), 'New Task');
  await user.type(screen.getByPlaceholderText(/description/i), 'Hello');
  await user.click(screen.getByRole('button', { name: /add/i }));

  await waitFor(() => expect(screen.getAllByRole('button', { name: /done/i }).length).toBe(5));

  const firstDone = screen.getAllByRole('button', { name: /done/i })[0];
  await user.click(firstDone);
  await waitFor(() => expect(screen.getAllByRole('button', { name: /done/i }).length).toBe(5));
});
