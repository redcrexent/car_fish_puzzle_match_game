import React from 'react';
import { images } from '../data/puzzleData';

function PuzzleArea({ puzzles, completed, onDrop, draggedOverPuzzle, onDragOver, onDragLeave }) {
  return (
    <div className="flex flex-wrap justify-center gap-4">
      {puzzles.map((puzzle) => {
        const isCompleted = completed.includes(puzzle.id);
        const isDraggedOver = draggedOverPuzzle === puzzle.id;

        return (
          <div
            key={puzzle.id}
            onPointerUp={() => onDrop(puzzle.id)}
            onPointerOver={() => onDragOver(puzzle.id)}
            onPointerLeave={onDragLeave}
            className={`w-48 h-48 sm:w-64 sm:h-64 border-4 border-dashed rounded-lg flex items-center justify-center bg-gray-200 relative ${
              isCompleted ? 'opacity-50' : ''
            } ${isDraggedOver ? 'ring-2 ring-secondary' : ''}`}
          >
            {/* Left half of the puzzle image */}
            <img
              src={images[puzzle.type].left}
              alt={`${puzzle.type} left`}
              className="w-1/2 h-full object-cover rounded-l-lg"
            />
            {/* Right half (blurred) as a placeholder */}
            <div className="w-1/2 h-full relative">
              <img
                src={images[puzzle.type][puzzle.correctHalf]}
                alt={`${puzzle.type} blurred ${puzzle.correctHalf}`}
                className="absolute inset-0 w-full h-full object-cover rounded-r-lg blur-sm"
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default PuzzleArea;