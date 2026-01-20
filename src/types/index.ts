export interface Task {
  id: string;
  name: string;
  description: string;
  createdAt: number;
  updatedAt: number;
}

export interface List {
  id: string;
  name: string;
  tasks: Task[];
  createdAt: number;
  sortOrder?: 'name' | 'created' | 'updated';
}

export interface BoardState {
  lists: List[];
  filterQuery: string;
  addList: (name: string) => void;
  updateListName: (listId: string, name: string) => void;
  deleteList: (listId: string) => void;
  addTask: (listId: string, name: string, description: string) => void;
  updateTask: (listId: string, taskId: string, name: string, description: string) => void;
  deleteTask: (listId: string, taskId: string) => void;
  moveTask: (fromListId: string, toListId: string, taskId: string, index: number) => void;
  sortList: (listId: string, sortOrder: 'name' | 'created' | 'updated') => void;
  setFilterQuery: (query: string) => void;
  reorderTasks: (listId: string, startIndex: number, endIndex: number) => void;
}
