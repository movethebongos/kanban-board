import React, { useState } from 'react';
import { Droppable } from '@hello-pangea/dnd';
import { useBoardStore } from '../../../store/useBoardStore';
import { TaskCard } from './TaskCard';
import { Button } from '../../../components/Button';
import { Input } from '../../../components/Input';
import { Textarea } from '../../../components/Textarea';
import { useFilteredTasks } from '../../../hooks/useFilteredTasks';
import { AnimatedContainer } from '../../../components/AnimatedContainer';
import type { List as ListType } from '../../../types';

interface ListColumnProps {
  list: ListType;
  index?: number;
}

export const ListColumn: React.FC<ListColumnProps> = ({ list, index = 0 }) => {
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [taskName, setTaskName] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [isEditingName, setIsEditingName] = useState(false);
  const [listName, setListName] = useState(list.name);

  const addTask = useBoardStore((state) => state.addTask);
  const updateListName = useBoardStore((state) => state.updateListName);
  const deleteList = useBoardStore((state) => state.deleteList);
  const sortList = useBoardStore((state) => state.sortList);
  const filterQuery = useBoardStore((state) => state.filterQuery);

  const filteredTasks = useFilteredTasks(list.tasks, filterQuery);

  const handleAddTask = () => {
    if (taskName.trim()) {
      addTask(list.id, taskName.trim(), taskDescription.trim());
      setTaskName('');
      setTaskDescription('');
      setIsAddingTask(false);
    }
  };

  const handleUpdateListName = () => {
    if (listName.trim()) {
      updateListName(list.id, listName.trim());
      setIsEditingName(false);
    }
  };

  const handleDeleteList = () => {
    if (confirm(`Are you sure you want to delete the list "${list.name}"?`)) {
      deleteList(list.id);
    }
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const sortOrder = e.target.value as 'name' | 'created' | 'updated';
    if (sortOrder) {
      sortList(list.id, sortOrder);
    }
  };

  return (
    <AnimatedContainer delay={0.5 + index * 0.15} className="flex-shrink-0 w-80 bg-white rounded-lg p-4 mr-4 shadow-md border border-accent-teal">
      {/* List Header */}
      <div className="mb-4">
        {isEditingName ? (
          <AnimatedContainer delay={0.1}>
            <div className="flex gap-2">
              <Input
                value={listName}
                onChange={(e) => setListName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleUpdateListName();
                  if (e.key === 'Escape') {
                    setListName(list.name);
                    setIsEditingName(false);
                  }
                }}
                autoFocus
                className="flex-1"
              />
              <Button size="sm" onClick={handleUpdateListName}>
                ✓
              </Button>
            </div>
          </AnimatedContainer>
        ) : (
          <div className="flex justify-between items-center mb-2">
            <AnimatedContainer delay={0.6 + index * 0.15}>
              <h2
                className="text-lg font-bold text-primary-dark cursor-pointer hover:text-primary transition-colors"
                onClick={() => setIsEditingName(true)}
                title="Click to edit"
              >
                {list.name}
              </h2>
            </AnimatedContainer>
            <AnimatedContainer delay={0.7 + index * 0.15}>
              <button
                onClick={handleDeleteList}
                className="text-accent-teal hover:text-accent-pink transition-colors"
                title="Delete list"
              >
                🗑️
              </button>
            </AnimatedContainer>
          </div>
        )}

        {/* Sort Controls */}
        <AnimatedContainer delay={0.65 + index * 0.15} className="flex gap-2 items-center">
          <select
            value={list.sortOrder || ''}
            onChange={handleSortChange}
            className="text-xs px-2 py-1 border border-accent-teal rounded focus:outline-none focus:ring-1 focus:ring-primary bg-background-light"
          >
            <option value="">No sort</option>
            <option value="name">Sort by name</option>
            <option value="created">Sort by created</option>
            <option value="updated">Sort by updated</option>
          </select>
          <AnimatedContainer delay={0.7 + index * 0.15}>
            <span className="text-xs text-text-light">
              {list.tasks.length} task{list.tasks.length !== 1 ? 's' : ''}
            </span>
          </AnimatedContainer>
        </AnimatedContainer>
      </div>

      {/* Add Task Form */}
      {isAddingTask ? (
        <AnimatedContainer delay={0.1} className="mb-4 p-3 bg-white rounded-lg shadow-sm space-y-2">
          <Input
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            placeholder="Task name"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleAddTask();
              }
            }}
          />
          <Textarea
            value={taskDescription}
            onChange={(e) => setTaskDescription(e.target.value)}
            placeholder="Description (optional)"
            rows={2}
            className="w-full px-3 py-2 border border-accent-teal rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary bg-background-light"
          />
          <div className="flex gap-2">
            <Button size="sm" onClick={handleAddTask}>
              Add
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => {
                setIsAddingTask(false);
                setTaskName('');
                setTaskDescription('');
              }}
            >
              Cancel
            </Button>
          </div>
        </AnimatedContainer>
      ) : (
        <AnimatedContainer delay={0.75 + index * 0.15}>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => setIsAddingTask(true)}
            className="w-full mb-4"
          >
            + Add Task
          </Button>
        </AnimatedContainer>
      )}

      {/* Tasks List */}
      <Droppable droppableId={list.id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`
              min-h-[100px] max-h-[calc(100vh-300px)] overflow-y-auto
              ${snapshot.isDraggingOver ? 'bg-background rounded-lg border-2 border-dashed border-primary' : ''}
            `}
          >
            {filteredTasks.length === 0 ? (
              <AnimatedContainer delay={0.8 + index * 0.15}>
                <div className="text-center text-text-light py-8 text-sm">
                  {filterQuery ? 'No tasks match the filter' : 'No tasks yet'}
                </div>
              </AnimatedContainer>
            ) : (
              filteredTasks.map((task, taskIndex) => {
                const originalIndex = list.tasks.findIndex((t) => t.id === task.id);
                return (
                  <TaskCard
                    key={task.id}
                    task={task}
                    index={originalIndex >= 0 ? originalIndex : taskIndex}
                    listId={list.id}
                  />
                );
              })
            )}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </AnimatedContainer>
  );
};
