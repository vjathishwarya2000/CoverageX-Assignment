import { render, screen } from '@testing-library/react';
import user from '@testing-library/user-event';
import TaskList from './TaskList';
import type { Task } from '../types';
import { expect, vi, test } from 'vitest';


const tasks: Task[] = [
  { id: 1, title: 'One', description: 'a', completed: false, createdAt: new Date().toISOString() },
  { id: 2, title: 'Two', description: 'b', completed: false, createdAt: new Date().toISOString() },
];

test('renders tasks and calls onDone', async () => {
  const onDone = vi.fn().mockResolvedValue(undefined);
  render(<TaskList tasks={tasks} loading={false} onDone={onDone} />);

  expect(screen.getByText('One')).toBeInTheDocument();
  const doneButtons = screen.getAllByRole('button', { name: /done/i });
  await user.click(doneButtons[0]);
  expect(onDone).toHaveBeenCalledWith(1);
});

test('shows empty state', () => {
  render(<TaskList tasks={[]} loading={false} onDone={vi.fn()} />);
  expect(screen.getByText(/no tasks yet/i)).toBeInTheDocument();
});
