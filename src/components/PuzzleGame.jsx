import React, { useState, useRef } from 'react';
import { images, initialPuzzles } from '../data/puzzleData';
import { useDragAndDrop } from 'react-aria';
import { useDroppableCollection } from 'react-aria';
import { useDroppableItem } from 'react-aria';
import { useDraggableCollection } from 'react-aria';
import { useDraggableItem } from 'react-aria';
import { useListState } from 'react-stately';

function PuzzleGame() {
  const [puzzles] = useState(initialPuzzles);
  const [currentPuzzleIndex, setCurrentPuzzleIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState([]);
  const [showOverlay, setShowOverlay] = useState(false);
  const [overlayImage, setOverlayImage] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  const currentPuzzle = puzzles[currentPuzzleIndex];
  const puzzleAreaRef = useRef(null);

  const { dragAndDropHooks } = useDragAndDrop({
    getItems(key) {
      return [{ 'text/plain': key }];
    },
    onDrop(e) {
      if (e.target.type === 'item' && e.source === 'drag') {
        const droppedItemId = e.items[0]['text/plain'];
        if (droppedItemId === currentPuzzle.type + '_' + currentPuzzle.correctHalf) {
          setScore(prevScore => prevScore + 1);
          setCompleted([...completed, currentPuzzle.id]);
          setShowOverlay(true);
          setOverlayImage(images[currentPuzzle.type].full);

          setTimeout(() => {
            setShowOverlay(false);
            nextPuzzle();
          }, 2000);
        } else {
          console.log('Incorrect!');
        }
      }
      setIsDragging(false);
    },
    onDragStart: () => {
      setIsDragging(true);
    },
    onDragEnd: () => {
      setIsDragging(false);
    },
  });

  const { collectionProps: droppableCollectionProps } = useDroppableCollection({
    ref: puzzleAreaRef,
  }, dragAndDropHooks);

  const { dropProps } = useDroppableItem({
    target: {
      type: 'item',
      key: currentPuzzle.id,
      dropPosition: 'on',
    }
  }, dragAndDropHooks, puzzleAreaRef);

  const listState = useListState({
    items: currentPuzzle.options.map(option => ({ key: option, textValue: option })),
  });

  const { collectionProps: draggableCollectionProps } = useDraggableCollection({}, dragAndDropHooks, listState);

  const nextPuzzle = () => {
    setCurrentPuzzleIndex((prevIndex) => (prevIndex + 1) % puzzles.length);
  };

  const isPuzzleCompleted = completed.includes(currentPuzzle.id);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold mb-4">Car &amp; Fish Puzzle Match</h1>
      <div className="text-2xl mb-4">Score: {score}</div>

      {showOverlay && (
        <div className="overlay">
          <img src={overlayImage} alt="Completed Puzzle" className="overlay-content" />
        </div>
      )}

      {currentPuzzle && !showOverlay && (
        <>
          <div
            ref={puzzleAreaRef}
            {...droppableCollectionProps}
            {...dropProps}
            className={`drop-target w-full max-w-md h-64 sm:h-48 border-4 border-dashed rounded-lg flex items-center justify-center bg-gray-200 relative ${isPuzzleCompleted ? 'opacity-50' : ''} ${isDragging ? 'drop-target-active' : ''}`}
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

          <div className="mt-8">
            <div className="flex flex-wrap justify-center gap-4" {...draggableCollectionProps}>
              {listState.items.map((item) => {
                const option = item.key;
                const optionRef = useRef(null);
                const { dragProps } = useDraggableItem({
                  key: option,
                  dragDisabled: isPuzzleCompleted
                }, dragAndDropHooks, optionRef);

                return (
                  <div
                    key={option}
                    ref={optionRef}
                    {...dragProps}
                    className={`draggable w-32 h-32 sm:w-24 sm:h-24 rounded-lg cursor-grab ${isDragging ? 'dragging' : ''} ${isPuzzleCompleted ? 'opacity-50 cursor-not-allowed' : ''}`}
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
