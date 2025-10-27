import type { Task } from '../types';

type Props = { task: Task; onDone: (id: number) => Promise<void> | void };

export default function TaskCard({ task, onDone }: Props) {
  return (
    <div className="container-card flex items-start justify-between gap-4 p-5">
      <div className="min-w-0">
        <div className="title truncate">{task.title}</div>
        {task.description && <div className="subtitle mt-1 line-clamp-2">{task.description}</div>}
      </div>
      <button className="card-button" onClick={() => onDone(task.id)}>Done</button>
    </div>
  );
}
