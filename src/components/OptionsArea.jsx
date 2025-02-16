import React from 'react';
import { images } from '../data/puzzleData';

function OptionsArea({ puzzles, completed, onDragStart, draggedItem }) {


  return (
    <div>
      <div className="flex flex-wrap gap-4">
        {puzzles.map((puzzle) =>
          puzzle.options.map((option) => {
            const isCompleted = completed.includes(puzzle.id);
            const isDragging = draggedItem === option;

            return (
              <div
                key={option}
                onPointerDown={() => onDragStart(option)}
                className={`w-32 h-32 rounded-lg cursor-grab ${
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
