import { describe, it, expect, beforeEach } from 'vitest';
import { useBoardStore } from '../useBoardStore';

describe('useBoardStore', () => {
  beforeEach(() => {
    // Reset store before each test
    useBoardStore.setState({
      lists: [],
      filterQuery: '',
    });
    localStorage.clear();
  });

  describe('Lists Management', () => {
    it('should add a new list', () => {
      const store = useBoardStore.getState();
      store.addList('Test List');
      
      const state = useBoardStore.getState();
      expect(state.lists).toHaveLength(1);
      expect(state.lists[0].name).toBe('Test List');
      expect(state.lists[0].tasks).toEqual([]);
    });

    it('should update list name', () => {
      const store = useBoardStore.getState();
      store.addList('Old Name');
      const listId = useBoardStore.getState().lists[0].id;
      
      store.updateListName(listId, 'New Name');
      
      const state = useBoardStore.getState();
      expect(state.lists[0].name).toBe('New Name');
    });

    it('should delete a list', () => {
      const store = useBoardStore.getState();
      store.addList('List 1');
      store.addList('List 2');
      const listId = useBoardStore.getState().lists[0].id;
      
      store.deleteList(listId);
      
      const state = useBoardStore.getState();
      expect(state.lists).toHaveLength(1);
      expect(state.lists[0].name).toBe('List 2');
    });
  });

  describe('Tasks Management', () => {
    it('should add a task to a list', () => {
      const store = useBoardStore.getState();
      store.addList('Test List');
      const listId = useBoardStore.getState().lists[0].id;
      
      store.addTask(listId, 'Task 1', 'Description 1');
      
      const state = useBoardStore.getState();
      expect(state.lists[0].tasks).toHaveLength(1);
      expect(state.lists[0].tasks[0].name).toBe('Task 1');
      expect(state.lists[0].tasks[0].description).toBe('Description 1');
    });

    it('should update a task', () => {
      const store = useBoardStore.getState();
      store.addList('Test List');
      const listId = useBoardStore.getState().lists[0].id;
      store.addTask(listId, 'Old Task', 'Old Description');
      const taskId = useBoardStore.getState().lists[0].tasks[0].id;
      
      const originalUpdatedAt = useBoardStore.getState().lists[0].tasks[0].updatedAt;
      store.updateTask(listId, taskId, 'New Task', 'New Description');

      const state = useBoardStore.getState();
      expect(state.lists[0].tasks[0].name).toBe('New Task');
      expect(state.lists[0].tasks[0].description).toBe('New Description');
      expect(state.lists[0].tasks[0].updatedAt).toBeGreaterThanOrEqual(
        originalUpdatedAt
      );
    });

    it('should delete a task', () => {
      const store = useBoardStore.getState();
      store.addList('Test List');
      const listId = useBoardStore.getState().lists[0].id;
      store.addTask(listId, 'Task 1', 'Description');
      store.addTask(listId, 'Task 2', 'Description');
      const taskId = useBoardStore.getState().lists[0].tasks[0].id;
      
      store.deleteTask(listId, taskId);
      
      const state = useBoardStore.getState();
      expect(state.lists[0].tasks).toHaveLength(1);
      expect(state.lists[0].tasks[0].name).toBe('Task 2');
    });
  });

  describe('Task Movement', () => {
    it('should move a task between lists', () => {
      const store = useBoardStore.getState();
      store.addList('List 1');
      store.addList('List 2');
      const list1Id = useBoardStore.getState().lists[0].id;
      const list2Id = useBoardStore.getState().lists[1].id;
      
      store.addTask(list1Id, 'Task 1', 'Description');
      const taskId = useBoardStore.getState().lists[0].tasks[0].id;
      
      store.moveTask(list1Id, list2Id, taskId, 0);
      
      const state = useBoardStore.getState();
      expect(state.lists[0].tasks).toHaveLength(0);
      expect(state.lists[1].tasks).toHaveLength(1);
      expect(state.lists[1].tasks[0].id).toBe(taskId);
    });

    it('should reorder tasks within the same list', () => {
      const store = useBoardStore.getState();
      store.addList('Test List');
      const listId = useBoardStore.getState().lists[0].id;
      
      store.addTask(listId, 'Task 1', 'Description');
      store.addTask(listId, 'Task 2', 'Description');
      store.addTask(listId, 'Task 3', 'Description');
      
      // Move task from index 0 to index 2
      store.reorderTasks(listId, 0, 2);
      
      const state = useBoardStore.getState();
      const newOrder = state.lists[0].tasks.map(t => t.name);
      expect(newOrder).toEqual(['Task 2', 'Task 3', 'Task 1']);
    });
  });

  describe('Sorting', () => {
    it('should sort tasks by name', () => {
      const store = useBoardStore.getState();
      store.addList('Test List');
      const listId = useBoardStore.getState().lists[0].id;
      
      store.addTask(listId, 'Zebra', 'Description');
      store.addTask(listId, 'Apple', 'Description');
      store.addTask(listId, 'Banana', 'Description');
      
      store.sortList(listId, 'name');
      
      const state = useBoardStore.getState();
      const names = state.lists[0].tasks.map(t => t.name);
      expect(names).toEqual(['Apple', 'Banana', 'Zebra']);
    });

    it('should sort tasks by creation date', () => {
      const store = useBoardStore.getState();
      store.addList('Test List');
      const listId = useBoardStore.getState().lists[0].id;
      
      // Add tasks with slight delays to ensure different timestamps
      store.addTask(listId, 'Task 1', 'Description');
      const task1Time = useBoardStore.getState().lists[0].tasks[0].createdAt;
      
      store.addTask(listId, 'Task 2', 'Description');
      store.addTask(listId, 'Task 3', 'Description');

      // Update tasks with known timestamps
      const state2 = useBoardStore.getState();
      const list = state2.lists.find(l => l.id === listId)!;
      const tasks = list.tasks.map((t, i) => ({
        ...t,
        createdAt: task1Time + i * 1000,
      }));
      
      useBoardStore.setState({
        lists: state2.lists.map(l =>
          l.id === listId ? { ...l, tasks } : l
        ),
      });
      
      store.sortList(listId, 'created');
      
      const finalState = useBoardStore.getState();
      const names = finalState.lists[0].tasks.map(t => t.name);
      expect(names).toEqual(['Task 1', 'Task 2', 'Task 3']);
    });
  });

  describe('Filtering', () => {
    it('should set filter query', () => {
      const store = useBoardStore.getState();
      store.setFilterQuery('test query');
      
      const state = useBoardStore.getState();
      expect(state.filterQuery).toBe('test query');
    });
  });
});
