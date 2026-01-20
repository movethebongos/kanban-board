import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useFilteredTasks } from '../useFilteredTasks';
import type { Task } from '../../types';

describe('useFilteredTasks', () => {
  const mockTasks: Task[] = [
    {
      id: '1',
      name: 'Task Alpha',
      description: 'First task',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
    {
      id: '2',
      name: 'Task Beta',
      description: 'Second task',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
    {
      id: '3',
      name: 'Task Gamma',
      description: 'Alpha description',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
  ];

  it('should return all tasks when filter query is empty', () => {
    const { result } = renderHook(() => useFilteredTasks(mockTasks, ''));
    expect(result.current).toHaveLength(3);
  });

  it('should filter tasks by name', () => {
    const { result } = renderHook(() => useFilteredTasks(mockTasks, 'Task Alpha'));
    expect(result.current).toHaveLength(1);
    expect(result.current[0].name).toBe('Task Alpha');
  });

  it('should filter tasks by description', () => {
    const { result } = renderHook(() => useFilteredTasks(mockTasks, 'Second'));
    expect(result.current).toHaveLength(1);
    expect(result.current[0].description).toBe('Second task');
  });

  it('should be case-insensitive', () => {
    const { result } = renderHook(() => useFilteredTasks(mockTasks, 'BETA'));
    expect(result.current).toHaveLength(1);
    expect(result.current[0].name).toBe('Task Beta');
  });

  it('should match partial strings', () => {
    const { result } = renderHook(() => useFilteredTasks(mockTasks, 'Gam'));
    expect(result.current).toHaveLength(1);
    expect(result.current[0].name).toBe('Task Gamma');
  });

  it('should return empty array when no matches', () => {
    const { result } = renderHook(() => useFilteredTasks(mockTasks, 'XYZ'));
    expect(result.current).toHaveLength(0);
  });
});
