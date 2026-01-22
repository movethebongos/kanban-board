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
      lists: [
        {
          id: 'list-1',
          name: 'To Do',
          createdAt: Date.now() - 100000,
          tasks: [
            {
              id: 'task-1',
              name: 'Try the Kanban Board',
              description: 'Explore the features and move this card around!',
              createdAt: Date.now() - 90000,
              updatedAt: Date.now() - 90000,
            },
            {
              id: 'task-2',
              name: 'Add your own tasks',
              description: 'Click "+ Add Task" to create a new task.',
              createdAt: Date.now() - 80000,
              updatedAt: Date.now() - 80000,
            },
          ],
        },
        {
          id: 'list-2',
          name: 'In Progress',
          createdAt: Date.now() - 70000,
          tasks: [
            {
              id: 'task-3',
              name: 'Drag tasks here',
              description: 'Move tasks between columns by dragging and dropping.',
              createdAt: Date.now() - 60000,
              updatedAt: Date.now() - 60000,
            },
          ],
        },
        {
          id: 'list-3',
          name: 'Done',
          createdAt: Date.now() - 50000,
          tasks: [
            {
              id: 'task-4',
              name: 'Enjoy productivity!',
              description: 'Mark tasks as done by moving them here.',
              createdAt: Date.now() - 40000,
              updatedAt: Date.now() - 40000,
            },
          ],
        },
      ],
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
