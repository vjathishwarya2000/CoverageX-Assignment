import type { Task } from '../types';
import TaskCard from './TaskCard';

type Props = { tasks: Task[]; onDone: (id: number) => Promise<void> | void; loading?: boolean };

export default function TaskList({ tasks, onDone, loading }: Props) {
  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="container-card h-20 animate-pulse bg-gray-100" />
        ))}
      </div>
    );
  }
  if (!tasks.length) {
    return (
      <div className="container-card p-6 text-center text-sm text-gray-500">
        No tasks yet. Add one on the left!
      </div>
    );
  }
  return (
    <div className="space-y-4">
      {tasks.map(t => <TaskCard key={t.id} task={t} onDone={onDone} />)}
    </div>
  );
}
