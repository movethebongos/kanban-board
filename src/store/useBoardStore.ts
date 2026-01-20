import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { BoardState, List, Task } from '../types';

const STORAGE_KEY = 'kanban-board-storage';

// Helper function to generate unique IDs
const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const useBoardStore = create<BoardState>()(
  persist(
    (set) => ({
      lists: [],
      filterQuery: '',

      addList: (name: string) => {
        const newList: List = {
          id: generateId(),
          name,
          tasks: [],
          createdAt: Date.now(),
        };
        set((state) => ({
          lists: [...state.lists, newList],
        }));
      },

      updateListName: (listId: string, name: string) => {
        set((state) => ({
          lists: state.lists.map((list) =>
            list.id === listId ? { ...list, name } : list
          ),
        }));
      },

      deleteList: (listId: string) => {
        set((state) => ({
          lists: state.lists.filter((list) => list.id !== listId),
        }));
      },

      addTask: (listId: string, name: string, description: string) => {
        const newTask: Task = {
          id: generateId(),
          name,
          description,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        set((state) => ({
          lists: state.lists.map((list) =>
            list.id === listId
              ? { ...list, tasks: [...list.tasks, newTask] }
              : list
          ),
        }));
      },

      updateTask: (listId: string, taskId: string, name: string, description: string) => {
        set((state) => ({
          lists: state.lists.map((list) =>
            list.id === listId
              ? {
                  ...list,
                  tasks: list.tasks.map((task) =>
                    task.id === taskId
                      ? { ...task, name, description, updatedAt: Date.now() }
                      : task
                  ),
                }
              : list
          ),
        }));
      },

      deleteTask: (listId: string, taskId: string) => {
        set((state) => ({
          lists: state.lists.map((list) =>
            list.id === listId
              ? { ...list, tasks: list.tasks.filter((task) => task.id !== taskId) }
              : list
          ),
        }));
      },

      moveTask: (fromListId: string, toListId: string, taskId: string, index: number) => {
        set((state) => {
          const fromList = state.lists.find((list) => list.id === fromListId);
          const task = fromList?.tasks.find((t) => t.id === taskId);

          if (!task) return state;

          return {
            lists: state.lists.map((list) => {
              if (list.id === fromListId) {
                return {
                  ...list,
                  tasks: list.tasks.filter((t) => t.id !== taskId),
                };
              }
              if (list.id === toListId) {
                const newTasks = [...list.tasks];
                newTasks.splice(index, 0, task);
                return { ...list, tasks: newTasks };
              }
              return list;
            }),
          };
        });
      },

      sortList: (listId: string, sortOrder: 'name' | 'created' | 'updated') => {
        set((state) => ({
          lists: state.lists.map((list) => {
            if (list.id !== listId) return list;

            const sortedTasks = [...list.tasks].sort((a, b) => {
              switch (sortOrder) {
                case 'name':
                  return a.name.localeCompare(b.name);
                case 'created':
                  return a.createdAt - b.createdAt;
                case 'updated':
                  return b.updatedAt - a.updatedAt;
                default:
                  return 0;
              }
            });

            return { ...list, tasks: sortedTasks, sortOrder };
          }),
        }));
      },

      reorderTasks: (listId: string, startIndex: number, endIndex: number) => {
        set((state) => ({
          lists: state.lists.map((list) => {
            if (list.id !== listId) return list;

            const newTasks = Array.from(list.tasks);
            const [removed] = newTasks.splice(startIndex, 1);
            newTasks.splice(endIndex, 0, removed);

            return { ...list, tasks: newTasks };
          }),
        }));
      },

      setFilterQuery: (query: string) => {
        set({ filterQuery: query });
      },
    }),
    {
      name: STORAGE_KEY,
      partialize: (state) => ({ lists: state.lists }),
    }
  )
);
