import React, { useState } from 'react';
import { Droppable } from '@hello-pangea/dnd';
import { useBoardStore } from '../../../store/useBoardStore';
import { TaskCard } from './TaskCard';
import { Button } from '../../../components/Button';
import { Input } from '../../../components/Input';
import { Textarea } from '../../../components/Textarea';
import { useFilteredTasks } from '../../../hooks/useFilteredTasks';
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
    <div className="list-column">
      {/* List Header */}
      <div className="mb-4">
        {isEditingName ? (
          <div>
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
          </div>
        ) : (
          <div className="flex justify-between items-center mb-2">
            <div>
              <h2
                className="text-lg font-bold text-primary-dark cursor-pointer hover:text-primary transition-colors list-title"
                onClick={() => setIsEditingName(true)}
                title="Click to edit"
              >
                {list.name}
              </h2>
            </div>
            <div className="flex gap-0 ml-2 lb task-buttons">
              <button
                onClick={handleDeleteList}
                className="text-accent-teal hover:text-accent-pink transition-colors list-delete-btn"
                title="Delete list"
              >
                🗑️
              </button>
            </div>
          </div>
        )}

        {/* Sort Controls */}
        <div className="flex gap-4 items-center">
          <select
            value={list.sortOrder || ''}
            onChange={handleSortChange}
            className="sort-dropdown"
          >
            <option value="">No sort</option>
            <option value="name">Sort by name</option>
            <option value="created">Sort by created</option>
            <option value="updated">Sort by updated</option>
          </select>
          <span className="task-count">
            {list.tasks.length} task{list.tasks.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* Add Task Form */}
      {isAddingTask ? (
        <div>
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
        </div>
      ) : (
        <div>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => setIsAddingTask(true)}
            className="w-full mb-4 add-task-btn"
          >
            + Add Task
          </Button>
        </div>
      )}

      {/* Tasks List */}
      <Droppable droppableId={list.id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`droppable-container min-h-[180px] max-h-[calc(100vh-200px)] overflow-y-auto
              ${snapshot.isDraggingOver ? 'bg-background rounded-lg border-2 border-dashed border-primary' : ''}
            `}
          >
            {filteredTasks.length === 0 ? (
              <div>
                <div className="text-center text-text-light py-8 text-sm">
                  {filterQuery ? 'No tasks match the filter' : 'No tasks yet'}
                </div>
              </div>
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
    </div>
  );
};
