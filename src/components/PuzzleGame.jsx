import React, { useState, useRef, useEffect } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';
import { images, initialPuzzles } from '../data/puzzleData';

const ItemTypes = {
  PIECE: 'piece',
};

export default function PuzzleGame() {
  const [puzzles] = useState(initialPuzzles);
  const [currentPuzzleIndex, setCurrentPuzzleIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState([]);
  const [key, setKey] = useState(0);
  const [fullScreenImage, setFullScreenImage] = useState(null);

  const currentPuzzle = puzzles[currentPuzzleIndex];
  const puzzleAreaRef = useRef(null);

  const nextPuzzle = useRef(() => {
    if (currentPuzzleIndex === puzzles.length - 1) {
      setCompleted([]);
      setCurrentPuzzleIndex(0);
      setKey((prevKey) => prevKey + 1);
    } else {
      setCurrentPuzzleIndex((prevIndex) => prevIndex + 1);
    }
  });

  useEffect(() => {
    nextPuzzle.current = () => {
      if (currentPuzzleIndex === puzzles.length - 1) {
        setCompleted([]);
        setCurrentPuzzleIndex(0);
        setKey((prevKey) => prevKey + 1);
      } else {
        setCurrentPuzzleIndex((prevIndex) => prevIndex + 1);
      }
    };
  }, [currentPuzzleIndex, puzzles.length]);

  const [{ isOver }, drop] = useDrop(() => ({
    accept: ItemTypes.PIECE,
    drop: (item) => {
      if (item.id === `${currentPuzzle.type}_${currentPuzzle.correctHalf}`) {
        setScore((prevScore) => prevScore + 1);
        setCompleted([...completed, currentPuzzle.id]);
        setFullScreenImage(images[currentPuzzle.type].full);
        setTimeout(() => {
          setFullScreenImage(null);
          nextPuzzle.current();
        }, 3000); // Hide the full-screen image after 3 seconds
      } else {
        if (puzzleAreaRef.current) {
          puzzleAreaRef.current.classList.add('shake');
          setTimeout(() => {
            if (puzzleAreaRef.current) {
              puzzleAreaRef.current.classList.remove('shake');
            }
          }, 500);
        }
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }), [currentPuzzle, completed, score]);

  const puzzleCompleted = completed.includes(currentPuzzle.id);
  const bgImage = currentPuzzle.type.startsWith('car') ? 'bg-[url("/road_bg.png")]' : 'bg-[url("/water_bg.png")]';

  return (
    <div className={`flex flex-col items-center justify-center min-h-screen bg-cover bg-center p-4 ${bgImage}`} key={key}>
      <div className="text-2xl sm:text-4xl mb-4 text-white font-bold shadow-lg">Score: {score}</div>

      {fullScreenImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 transition-opacity duration-500">
          <img src={fullScreenImage} alt="Full Screen Puzzle" className="max-w-full max-h-full rounded-lg shadow-2xl" />
        </div>
      )}

      <PuzzleArea
        puzzleAreaRef={puzzleAreaRef}
        drop={drop}
        currentPuzzle={currentPuzzle}
        puzzleCompleted={puzzleCompleted}
        isOver={isOver}
      />

      <div className="mt-8">
        <div className="flex flex-wrap justify-center gap-4">
          {currentPuzzle.options.map((option) => (
            <PuzzlePiece key={option} id={option} puzzleCompleted={puzzleCompleted} currentPuzzle={currentPuzzle} />
          ))}
        </div>
      </div>
    </div>
  );
}

function PuzzleArea({ puzzleAreaRef, drop, currentPuzzle, puzzleCompleted, isOver }) {
  return (
    <div
      ref={(node) => {
        puzzleAreaRef.current = node;
        drop(node);
      }}
      className={`drop-target w-full max-w-md h-48 sm:h-64 border-4 border-dashed rounded-lg flex items-center justify-center bg-gray-200 relative ${isOver ? 'drop-target-active' : ''} transition-transform shadow-lg`}
      aria-label={`Puzzle area for ${currentPuzzle.type}`}
    >
      <>
        <img
          src={images[currentPuzzle.type].left}
          alt={`${currentPuzzle.type} left`}
          className="w-1/2 h-full object-cover rounded-l-lg"
        />
        <div className="w-1/2 h-full relative">
          {!puzzleCompleted && (
            <img
              src={images[currentPuzzle.type][currentPuzzle.correctHalf]}
              alt={`${currentPuzzle.type} blurred ${currentPuzzle.correctHalf}`}
              className="absolute inset-0 w-full h-full object-cover rounded-r-lg blur-sm"
            />
          )}
        </div>
      </>
      {puzzleCompleted && <div className="absolute inset-0 bg-gray-200 opacity-50 rounded-lg"></div>}
    </div>
  );
}

function PuzzlePiece({ id, puzzleCompleted, currentPuzzle }) {
  const [{ isDragging }, drag, preview] = useDrag(() => ({
    type: ItemTypes.PIECE,
    item: { id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const [position, setPosition] = useState({ x: 0, y: 0 });
  const pieceRef = useRef(null);

  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true });
  }, [preview]);

  const handleTouchMove = (e) => {
    const touch = e.touches[0];
    const rect = pieceRef.current.getBoundingClientRect();
    setPosition({ x: touch.clientX - rect.width / 2, y: touch.clientY - rect.height / 2 });
  };

  const handleTouchEnd = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <div
      ref={(node) => {
        drag(node);
        pieceRef.current = node;
      }}
      className={`draggable w-24 h-24 sm:w-32 sm:h-32 rounded-lg cursor-grab transition-transform duration-300 ${isDragging ? 'ring-4 ring-accent scale-110 shadow-xl' : ''} ${puzzleCompleted ? 'opacity-50 cursor-not-allowed' : ''}`}
      aria-label={`Puzzle piece ${id}`}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{ transform: `translate(${position.x}px, ${position.y}px)` }}
    >
      <img
        src={images[id.split('_')[0]][id.split('_')[1]]}
        alt={id}
        className="w-full h-full object-cover rounded-lg"
        onError={(e) => {
          console.error("Error loading image:", e.target.src);
        }}
      />
    </div>
  );
}