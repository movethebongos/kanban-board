import React, { useState } from 'react';
import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import { useBoardStore } from '../../../store/useBoardStore';
import { ListColumn } from './ListColumn';
import { Button } from '../../../components/Button';
import { Input } from '../../../components/Input';
import { AnimatedContainer } from '../../../components/AnimatedContainer';

export const KanbanBoard: React.FC = () => {
  const [isAddingList, setIsAddingList] = useState(false);
  const [listName, setListName] = useState('');
  
  const lists = useBoardStore((state) => state.lists);
  const filterQuery = useBoardStore((state) => state.filterQuery);
  const addList = useBoardStore((state) => state.addList);
  const moveTask = useBoardStore((state) => state.moveTask);
  const reorderTasks = useBoardStore((state) => state.reorderTasks);
  const setFilterQuery = useBoardStore((state) => state.setFilterQuery);

  const handleAddList = () => {
    if (listName.trim()) {
      addList(listName.trim());
      setListName('');
      setIsAddingList(false);
    }
  };

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    const sourceListId = source.droppableId;
    const destinationListId = destination.droppableId;

    if (sourceListId === destinationListId) {
      // Reordering within the same list
      reorderTasks(sourceListId, source.index, destination.index);
    } else {
      // Moving between lists
      moveTask(sourceListId, destinationListId, draggableId, destination.index);
    }
  };

  return (
    <div
      className="min-h-screen bg-background p-6 page-background"
    >
      <div className="max-w-full mb-6">
        <h1 className="text-3xl font-bold text-primary-dark">
          BECAUSE WE KANBAN-CAN!
        </h1>

        {/* Filter and Add List Controls */}
        <div className="flex gap-4 items-center mb-4 flex-wrap">
          <div className="flex-1 min-w-[200px]">
            <Input
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              placeholder="Filter tasks by name or description..."
              className="w-full"
            />
          </div>
          
          {isAddingList ? (
            <div className="flex gap-2">
              <Input
                value={listName}
                onChange={(e) => setListName(e.target.value)}
                placeholder="List name"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAddList();
                  if (e.key === 'Escape') {
                    setIsAddingList(false);
                    setListName('');
                  }
                }}
                autoFocus
                className="w-48 name-input"
              />
              <Button size="md" onClick={handleAddList}>
                Add
              </Button>
              <Button
                size="md"
                variant="secondary"
                onClick={() => {
                  setIsAddingList(false);
                  setListName('');
                }}
              >
                Cancel
              </Button>
            </div>
          ) : (
            <Button onClick={() => setIsAddingList(true)}>
              + Add List
            </Button>
          )}
        </div>
      </div>

      {/* Board */}
      {lists.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-lg shadow-sm border border-accent-teal">
          <p className="text-text-light text-lg mb-4">
            No lists yet. Create your first list to get started!
          </p>
          <Button onClick={() => setIsAddingList(true)}>
            Create First List
          </Button>
        </div>
      ) : (
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex overflow-x-auto pb-4" style={{ scrollbarWidth: 'thin' }}>
            {lists.map((list, index) => (
              <ListColumn key={list.id} list={list} index={index} />
            ))}

          </div>
        </DragDropContext>
      )}
    </div>
  );
};

