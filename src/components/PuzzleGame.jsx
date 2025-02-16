import React, { useState, useRef, useEffect } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { images, initialPuzzles } from '../data/puzzleData';

const ItemTypes = {
  PIECE: 'piece',
};

function PuzzleGame() {
  const [puzzles] = useState(initialPuzzles);
  const [currentPuzzleIndex, setCurrentPuzzleIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState([]);
    const [key, setKey] = useState(0);


  const currentPuzzle = puzzles[currentPuzzleIndex];
  const puzzleAreaRef = useRef(null); // Ref for the puzzle area

    const nextPuzzle = () => {
    if (currentPuzzleIndex === puzzles.length - 1) {
      // Reset the game if we're at the last puzzle
      setCompleted([]);
      setCurrentPuzzleIndex(0);
      setKey(prevKey => prevKey + 1); // Force re-render
    } else {
      setCurrentPuzzleIndex((prevIndex) => prevIndex + 1);
    }
  };


  const [{ isOver }, drop] = useDrop(() => ({
    accept: ItemTypes.PIECE,
    drop: (item) => {
      // Correctly check against the *current* puzzle's expected answer
      if (item.id === `${currentPuzzle.type}_${currentPuzzle.correctHalf}`) {
        setScore((prevScore) => prevScore + 1);
        setCompleted([...completed, currentPuzzle.id]);
        nextPuzzle();
      } else {
        console.log('Incorrect!');
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }), [currentPuzzle, nextPuzzle]); // Add currentPuzzle and nextPuzzle as dependencies

  const isCompleted = completed.includes(currentPuzzle.id);

  return (
    <div className="flex flex-col items-center justify-center h-screen" key={key}>
      <h1 className="text-4xl font-bold mb-4">Car &amp; Fish Puzzle Match</h1>
      <div className="text-2xl mb-4">Score: {score}</div>

      {/* Puzzle Area */}
      <div
        ref={(node) => {
          puzzleAreaRef.current = node;
          drop(node);
        }}
        className={`drop-target w-full max-w-md h-64 border-4 border-dashed rounded-lg flex items-center justify-center bg-gray-200 relative ${
          isCompleted ? 'opacity-50' : ''
        } ${isOver ? 'drop-target-active' : ''}`}
      >
        <img
          src={images[currentPuzzle.type].left}
          alt={`${currentPuzzle.type} left`}
          className="w-1/2 h-full object-cover rounded-l-lg"
        />
        <div className="w-1/2 h-full relative">
          <img
            src={images[currentPuzzle.type][currentPuzzle.correctHalf]}
            alt={`${currentPuzzle.type} blurred ${currentPuzzle.correctHalf}`}
            className="absolute inset-0 w-full h-full object-cover rounded-r-lg blur-sm"
          />
        </div>
      </div>

      {/* Options Area */}
      <div className="mt-8">
        <div className="flex flex-wrap justify-center gap-4">
          {currentPuzzle.options.map((option) => (
            <PuzzlePiece key={option} id={option} isCompleted={isCompleted} />
          ))}
        </div>
      </div>
    </div>
  );
}

function PuzzlePiece({ id, isCompleted }) {
    const [{ isDragging }, drag] = useDrag(() => ({
        type: ItemTypes.PIECE,
        item: { id },
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
    }));

    return (
        <div
            ref={drag}
            className={`draggable w-32 h-32 rounded-lg cursor-grab ${
                isDragging ? 'dragging' : ''
            } ${isCompleted ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
            <img
                src={images[id.split('_')[0]][id.split('_')[1]]}
                alt={id}
                className="w-full h-full object-cover rounded-lg"
            />
        </div>
    );
}

export default PuzzleGame;
