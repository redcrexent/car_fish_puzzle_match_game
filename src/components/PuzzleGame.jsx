import React, { useState, useRef, useEffect } from 'react';
import { images, initialPuzzles } from '../data/puzzleData';
import { createDraggable, createDroppable, onDragStart, onDragMove, onDrop } from '@atlaskit/pragmatic-drag-and-drop';

function PuzzleGame() {
    const [puzzles] = useState(initialPuzzles);
    const [currentPuzzleIndex, setCurrentPuzzleIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [completed, setCompleted] = useState([]);
    const [draggedItem, setDraggedItem] = useState(null);

    const currentPuzzle = puzzles[currentPuzzleIndex];
    const puzzleAreaRef = useRef(null);
    const optionRefs = useRef({});

    // Draggable setup (for options)
    useEffect(() => {
        const cleanups = currentPuzzle.options.map((option) => {
            const element = optionRefs.current[option];
            if (!element) return () => {};

            return createDraggable(element, {
                getDraggableId: () => option,
                onDragStart: (args) => {
                    setDraggedItem(args.draggableId);
                    onDragStart(args);
                },
                onDragMove,
                onDrop: (args) => {
                    onDrop(args);
                }
            });
        });
        return () => {
            cleanups.forEach((cleanup) => cleanup());
        };
    }, [currentPuzzle.options]);

    // Droppable setup (for puzzle area)
    useEffect(() => {
        if (!puzzleAreaRef.current) return;

        const cleanup = createDroppable(puzzleAreaRef.current, {
            getDroppableId: () => currentPuzzle.id,
            onDrop: (args) => {
                if (args.draggableId === currentPuzzle.type + '_' + currentPuzzle.correctHalf) {
                    setScore((prevScore) => prevScore + 1);
                    setCompleted([...completed, currentPuzzle.id]);
                    nextPuzzle();
                } else {
                    console.log('Incorrect!');
                }
                setDraggedItem(null);
            },
             canDrop: (args) => {
                return true;
            },
        });

        return cleanup;
    }, [currentPuzzle, completed, score, nextPuzzle]);


    const nextPuzzle = () => {
        setCurrentPuzzleIndex((prevIndex) => (prevIndex + 1) % puzzles.length);
    };

    const isCompleted = completed.includes(currentPuzzle.id);

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-4xl font-bold mb-4">Car &amp; Fish Puzzle Match</h1>
            <div className="text-2xl mb-4">Score: {score}</div>

            {/* Puzzle Area */}
            <div
                ref={puzzleAreaRef}
                className={`drop-target w-full max-w-md h-64 border-4 border-dashed rounded-lg flex items-center justify-center bg-gray-200 relative ${isCompleted ? 'opacity-50' : ''} ${draggedItem ? 'drop-target-active' : ''}`}

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
                                ref={el => optionRefs.current[option] = el}
                                className={`draggable w-32 h-32 rounded-lg cursor-grab ${isDragging ? 'dragging' : ''} ${isCompleted ? 'opacity-50 cursor-not-allowed' : ''}`}
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
        </div>
    );
}

export default PuzzleGame;
