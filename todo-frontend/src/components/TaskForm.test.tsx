import { render, screen } from '@testing-library/react';
import user from '@testing-library/user-event';
import TaskForm from './TaskForm';
import { expect, test, vi } from 'vitest';


test('calls onAdd with title+description and clears inputs', async () => {
  const onAdd = vi.fn().mockResolvedValue(undefined);
  render(<TaskForm onAdd={onAdd} />);

  await user.type(screen.getByPlaceholderText(/title/i), 'Buy milk');
  await user.type(screen.getByPlaceholderText(/description/i), '2 liters');
  await user.click(screen.getByRole('button', { name: /add/i }));

  expect(onAdd).toHaveBeenCalledWith('Buy milk', '2 liters');
  expect(screen.getByPlaceholderText(/title/i)).toHaveValue('');
  expect(screen.getByPlaceholderText(/description/i)).toHaveValue('');
});

test('does not submit with empty title', async () => {
  const onAdd = vi.fn();
  render(<TaskForm onAdd={onAdd} />);
  await user.click(screen.getByRole('button', { name: /add/i }));
  expect(onAdd).not.toHaveBeenCalled();
});
