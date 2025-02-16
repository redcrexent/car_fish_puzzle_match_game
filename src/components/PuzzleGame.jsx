import React, { useState, useEffect } from 'react';
import { images, initialPuzzles } from '../data/puzzleData';

function PuzzleGame() {
  const [puzzles] = useState(initialPuzzles);
  const [currentPuzzleIndex, setCurrentPuzzleIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState([]);
  const [draggedItem, setDraggedItem] = useState(null);
  const [draggedOverPuzzle, setDraggedOverPuzzle] = useState(null);
  const [showOverlay, setShowOverlay] = useState(false);
  const [overlayImage, setOverlayImage] = useState('');

  const handleDrop = (puzzleId) => {
    if (!draggedItem) return;

    const puzzle = puzzles.find((p) => p.id === puzzleId);

    if (puzzle && draggedItem === puzzle.type + '_' + puzzle.correctHalf) {
      setScore((prevScore) => prevScore + 1);
      setCompleted([...completed, puzzle.id]);
      setShowOverlay(true);
      setOverlayImage(images[puzzle.type].full);

      console.log("Correct Match! Showing overlay and setting timeout..."); // Debug log

      setTimeout(() => {
        setShowOverlay(false);
        nextPuzzle();
        console.log("Timeout finished, overlay hidden, nextPuzzle called."); // Debug log
      }, 2000);

    } else {
      console.log('Incorrect!');
    }
    setDraggedItem(null);
    setDraggedOverPuzzle(null);
  };

  const handleDragStart = (itemId) => {
    setDraggedItem(itemId);
  };

  const handleDragOver = (puzzleId) => {
    setDraggedOverPuzzle(puzzleId);
  };

  const handleDragLeave = () => {
    setDraggedOverPuzzle(null);
  };

  const nextPuzzle = () => {
    console.log("nextPuzzle called - currentPuzzleIndex before:", currentPuzzleIndex); // Debug log
    setCurrentPuzzleIndex((prevIndex) => {
      const nextIndex = (prevIndex + 1) % puzzles.length;
      console.log("nextPuzzle - currentPuzzleIndex after:", nextIndex); // Debug log
      return nextIndex;
    });
  };


  const isCompleted = completed.includes(puzzles[currentPuzzleIndex]?.id);
  const currentPuzzle = puzzles[currentPuzzleIndex];

  useEffect(() => {
      return () => clearTimeout();
  }, [currentPuzzleIndex]);


  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold mb-4">Car &amp; Fish Puzzle Match</h1>
      <div className="text-2xl mb-4">Score: {score}</div>

      {/* Fullscreen Overlay */}
      {showOverlay && (
        <div className="overlay">
          <img src={overlayImage} alt="Completed Puzzle" className="overlay-content" />
        </div>
      )}

      {currentPuzzle && !showOverlay && (
      <>
      {/* Puzzle Area */}
      <div
        onPointerUp={() => handleDrop(currentPuzzle.id)}
        onPointerOver={() => handleDragOver(currentPuzzle.id)}
        onPointerLeave={handleDragLeave}
        className={`w-full max-w-md h-64  border-4 border-dashed rounded-lg flex items-center justify-center bg-gray-200 relative ${
          isCompleted ? 'opacity-50' : ''
        } ${draggedOverPuzzle === currentPuzzle.id ? 'ring-2 ring-secondary' : ''}`}
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
          {currentPuzzle.options.map((option) => {
            const isDragging = draggedItem === option;
            return (
              <div
                key={option}
                onPointerDown={() => handleDragStart(option)}
                className={`w-32 h-32 rounded-lg cursor-grab ${
                  isDragging ? 'dragging' : ''
                } ${isCompleted ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <img
                  src={images[option.split('_')[0]][option.split('_')[1]]}
                  alt={option}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
            );
          })}
        </div>
      </div>
      </>
      )}
    </div>
  );
}

export default PuzzleGame;
