import { useMemo } from 'react';
import type { Task } from '../types';

export const useFilteredTasks = (tasks: Task[], filterQuery: string): Task[] => {
  return useMemo(() => {
    if (!filterQuery.trim()) return tasks;
    
    const query = filterQuery.toLowerCase();
    return tasks.filter(
      (task) =>
        task.name.toLowerCase().includes(query) ||
        task.description.toLowerCase().includes(query)
    );
  }, [tasks, filterQuery]);
};
