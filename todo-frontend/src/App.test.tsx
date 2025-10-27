import { render, screen, waitFor } from '@testing-library/react';
import user from '@testing-library/user-event';
import App from './App';
import { expect, beforeAll, test } from 'vitest';


// environment var used by api.ts (if you read VITE_API_BASE_URL there)
beforeAll(() => {
  // ensure axios/fetch baseURL points to http://localhost:8080/api
  (import.meta as any).env = { VITE_API_BASE_URL: 'http://localhost:8080/api' };
});

test('loads 5 tasks, adds one, marks one done', async () => {
  render(<App />);

  // loads initial list
  await waitFor(() =>
    expect(screen.getByRole('heading', { level: 2, name: /tasks to be done/i }))
      .toBeInTheDocument()
  );
  
  // 5 cards should be there
  expect(screen.getAllByRole('button', { name: /done/i }).length).toBe(5);

  // add a task
  await user.type(screen.getByPlaceholderText(/title/i), 'New Task');
  await user.type(screen.getByPlaceholderText(/description/i), 'Hello');
  await user.click(screen.getByRole('button', { name: /add/i }));

  // toast shows, and list is refreshed (still 5 visible — “most recent”)
  await waitFor(() => expect(screen.getAllByRole('button', { name: /done/i }).length).toBe(5));

  // mark first as done -> list refetch keeps 5
  const firstDone = screen.getAllByRole('button', { name: /done/i })[0];
  await user.click(firstDone);
  await waitFor(() => expect(screen.getAllByRole('button', { name: /done/i }).length).toBe(5));
});
