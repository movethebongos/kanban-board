import React, { useState } from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { useBoardStore } from '../../../store/useBoardStore';
import { Button } from '../../../components/Button';
import { Input } from '../../../components/Input';
import { Textarea } from '../../../components/Textarea';
import type { Task } from '../../../types';

interface TaskCardProps {
  task: Task;
  index: number;
  listId: string;
}


export const TaskCard: React.FC<TaskCardProps> = ({ task, index, listId }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(task.name);
  const [description, setDescription] = useState(task.description);
  const updateTask = useBoardStore((state) => state.updateTask);
  const deleteTask = useBoardStore((state) => state.deleteTask);

  const handleSave = () => {
    if (name.trim()) {
      updateTask(listId, task.id, name.trim(), description.trim());
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setName(task.name);
    setDescription(task.description);
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this task?')) {
      deleteTask(listId, task.id);
    }
  };

  const taskContent = (
    <>
      {isEditing ? (
        <div className="space-y-3">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Task name"
            autoFocus
          />
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Task description"
            rows={3}
          />
          <div className="flex gap-2">
            <Button size="sm" onClick={handleSave}>
              Save
            </Button>
            <Button size="sm" variant="secondary" onClick={handleCancel}>
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-primary-dark flex-1">{task.name}</h3>
            <div className="flex gap-0 ml-2 task-buttons">
              <button
                onClick={() => setIsEditing(true)}
                className="text-accent-teal hover:text-primary text-sm transition-colors"
                title="Edit task"
              >
                ✏️
              </button>
              <button
                onClick={handleDelete}
                className="text-accent-teal hover:text-accent-pink text-sm transition-colors task-delete-btn"
                title="Delete task"
              >
                🗑️
              </button>
            </div>
          </div>
          {task.description && (
            <p className="text-sm text-text-light whitespace-pre-wrap">
              {task.description}
            </p>
          )}
        </>
      )}
    </>
  );

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`task-card p-4 mb-3 cursor-move border-2 transition-all ${
            snapshot.isDragging
              ? 'shadow-2xl border-primary bg-background dragging'
              : 'shadow-sm border-accent-teal hover:border-primary hover:shadow-md'
          }`}
        >
          {taskContent}
        </div>
      )}
    </Draggable>
  );
};