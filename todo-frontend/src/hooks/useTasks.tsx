import { useCallback, useEffect, useMemo, useState } from 'react';
import api from '../services/api';
import type { Task } from '../types';

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get<Task[]>('/tasks', { params: { limit: 5 } });
      const sorted = (Array.isArray(data) ? data : [])
        .filter(t => !t.completed)
        .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
      setTasks(sorted.slice(0, 5));
    } finally {
      setLoading(false);
    }
  }, []);

  const addTask = useCallback(async (title: string, description: string) => {
    await api.post<Task>('/tasks', { title, description });
    await fetchTasks();            // keep source of truth the server
  }, [fetchTasks]);

  const completeTask = useCallback(async (id: number) => {
    await api.patch(`/tasks/${id}/complete`);
    await fetchTasks();            // << re-fetch to fill back to 5
  }, [fetchTasks]);

  useEffect(() => { void fetchTasks(); }, [fetchTasks]);

  return useMemo(
    () => ({ tasks, loading, addTask, completeTask, refresh: fetchTasks }),
    [tasks, loading, addTask, completeTask, fetchTasks]
  );
}
