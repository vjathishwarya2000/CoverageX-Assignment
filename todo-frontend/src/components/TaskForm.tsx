import { useState } from 'react';
import type { FormEvent } from 'react';


type Props = { onAdd: (title: string, description: string) => Promise<void> | void };

export default function TaskForm({ onAdd }: Props) {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [busy, setBusy] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setBusy(true);
    try {
      await onAdd(title.trim(), desc.trim());
      setTitle(''); setDesc('');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="container-card p-6">
      <h2 className="mb-4 text-xl font-bold">Add a Task</h2>
      <form onSubmit={onSubmit} className="space-y-3">
        <input
          className="input"
          placeholder="Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          maxLength={120}
        />
        <textarea
          className="input min-h-[96px] resize-y"
          placeholder="Description"
          value={desc}
          onChange={e => setDesc(e.target.value)}
          maxLength={500}
        />
        <button className="button" disabled={busy || !title.trim()} type="submit">
          {busy ? 'Adding…' : 'Add'}
        </button>
      </form>
    </div>
  );
}
