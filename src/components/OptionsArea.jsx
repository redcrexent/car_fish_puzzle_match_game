import React, { useRef } from 'react';
import { images } from '../data/puzzleData';

function OptionsArea({ puzzles, completed, onDragStart, draggedItem }) {
  const dragItemRef = useRef(null);

  const handlePointerDown = (itemId) => {
    onDragStart(itemId);
    dragItemRef.current = itemId; // Store the dragged item ID
  }

  return (
    <div>
      <div className="flex flex-wrap gap-4 justify-center">
        {puzzles.map((puzzle) =>
          puzzle.options.map((option) => {
            const isCompleted = completed.includes(puzzle.id);
            const isDragging = draggedItem === option;

            return (
              <div
                key={option}
                onPointerDown={() => handlePointerDown(option)}
                className={`w-24 h-24 sm:w-32 sm:h-32 rounded-lg cursor-grab ${
                  isDragging ? 'dragging' : ''
                } ${isCompleted ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {/* Image option */}
                <img
                  src={images[option.split('_')[0]][option.split('_')[1]]}
                  alt={option}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default OptionsArea;