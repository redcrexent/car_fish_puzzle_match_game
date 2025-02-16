import React, { useState, useRef, useEffect } from 'react';
import { useDrag, useDrop, useDragLayer } from 'react-dnd'; // Import useDragLayer
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

    // Use a ref to store nextPuzzle, ensuring it's always up-to-date
  const nextPuzzle = useRef((puzzleId) => { // Accept puzzleId
    if (currentPuzzleIndex === puzzles.length - 1) {
      setCompleted([]);
      setCurrentPuzzleIndex(0);
      setKey((prevKey) => prevKey + 1);
    } else {
      setCurrentPuzzleIndex((prevIndex) => prevIndex + 1);
       // Update completed *here*, in sync with the puzzle index change
    }
     setCompleted((prevCompleted) => [...prevCompleted, puzzleId]);
  });

  // Update the ref whenever nextPuzzle's dependencies change
  useEffect(() => {
    nextPuzzle.current = (puzzleId) => { // Accept puzzleId
        if (currentPuzzleIndex === puzzles.length - 1) {
            setCompleted([]);
            setCurrentPuzzleIndex(0);
            setKey(prevKey => prevKey + 1);
        } else {
            setCurrentPuzzleIndex(prevIndex => prevIndex + 1);
        }
        setCompleted((prevCompleted) => [...prevCompleted, puzzleId]);
    };
  }, [currentPuzzleIndex, puzzles.length]);


    const [{ isOver }, drop] = useDrop(() => ({
    accept: ItemTypes.PIECE,
    drop: (item) => {
      if (item.id === `${currentPuzzle.type}_${currentPuzzle.correctHalf}`) {
        setScore((prevScore) => prevScore + 1);
        // setCompleted([...completed, currentPuzzle.id]); // No longer update here
        nextPuzzle.current(currentPuzzle.id); // Call with the completed puzzle ID
      } else {
          // Add visual feedback for incorrect drop (e.g., a shake)
          if (puzzleAreaRef.current) {
            puzzleAreaRef.current.classList.add('shake');
            setTimeout(() => {
              if (puzzleAreaRef.current) { // Check if ref is still valid
                puzzleAreaRef.current.classList.remove('shake');
              }
            }, 500); // Remove the class after 500ms
          }
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
    }), [currentPuzzle, score]); //correct dependencies remove completed

  const puzzleCompleted = completed.includes(currentPuzzle.id);

    // Determine the background image based on the puzzle type
  const bgImage = currentPuzzle.type.startsWith('car') ? 'bg-[url("/road_bg.png")]' : 'bg-[url("/water_bg.png")]';

    const { isDragging, item, clientOffset } = useDragLayer((monitor) => ({
        isDragging: monitor.isDragging(),
        item: monitor.getItem(),
        clientOffset: monitor.getClientOffset(),
    }));


  return (
    <div
      className={`flex flex-col items-center justify-center min-h-screen bg-cover bg-center p-4 ${bgImage}`}
      key={key}
    >
      <div className="text-2xl sm:text-4xl mb-4 text-white">Score: {score}</div>

      {/* Puzzle Area */}
      <PuzzleArea
        puzzleAreaRef={puzzleAreaRef}
        drop={drop}
        currentPuzzle={currentPuzzle}
        puzzleCompleted={puzzleCompleted}
        isOver={isOver}
      />

      {/* Options Area */}
      <div className="mt-8">
        <div className="flex flex-wrap justify-center gap-4">
          {currentPuzzle.options.map((option) => (
            <PuzzlePiece key={option} id={option} puzzleCompleted={puzzleCompleted} currentPuzzle={currentPuzzle}/>
          ))}
        </div>
      </div>
        {isDragging && clientOffset && (
            <DragPreview item={item} clientOffset={clientOffset} />
        )}
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
            className={`drop-target w-full max-w-md h-48 sm:h-64 border-4 border-dashed rounded-lg flex items-center justify-center bg-gray-200 relative  ${isOver ? 'drop-target-active' : ''} transition-transform`}
            aria-label={`Puzzle area for ${currentPuzzle.type}`}
        >
            <>
                <img
                    src={images[currentPuzzle.type].left}
                    alt={`${currentPuzzle.type} left`}
                    className="w-1/2 h-full object-cover rounded-l-lg"
                />
                <div className="w-1/2 h-full relative">
                    {/* Only show the blurred image if the puzzle is NOT completed */}
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
      className={`draggable w-24 h-24 sm:w-32 sm:h-32 rounded-lg cursor-grab ${
        isDragging ? 'ring-4 ring-accent scale-110 shadow-xl' : '' // Enhanced styling
      } ${puzzleCompleted ? 'opacity-50 cursor-not-allowed' : ''}`}
      aria-label={`Puzzle piece ${id}`}
    >
      <img
        src={images[id.split('_')[0]][id.split('_')[1]]}
        alt={id}
        className="w-full h-full object-cover rounded-lg"
        onError={(e) => { // Check for image loading errors
          console.error("Error loading image:", e.target.src);
        }}
      />
    </div>
  );
}

// Custom Drag Preview Component
function DragPreview({ item, clientOffset }) {
    if (!item || !clientOffset) {
        return null;
    }

    const { x, y } = clientOffset;

    const previewStyle = {
        position: 'absolute',
        left: x,
        top: y,
        transform: 'translate(-50%, -50%)', // Center the preview on the touch point
        zIndex: 1000, // Ensure it's above other elements
    };

    return (
        <div style={previewStyle} className="w-32 h-32">
            <img
                src={images[item.id.split('_')[0]][item.id.split('_')[1]]}
                alt={item.id}
                className="w-full h-full object-cover rounded-lg"
            />
        </div>
    );
}

export default PuzzleGame;
