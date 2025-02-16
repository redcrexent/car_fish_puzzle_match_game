// Placeholder image assets (replace with actual paths)
export const images = {
  car1: {
    full: '/car1.png',
    left: '/car1_left.png',
    right: '/car1_right.png',
  },
  fish1: {
    full: '/fish1.png',
    left: '/fish1_left.png',
    right: '/fish1_right.png',
  },
  car2: {
    full: '/car2.png',
    left: '/car2_left.png',
    right: '/car2_right.png',
  },
  fish2: {
    full: '/fish2.png',
    left: '/fish2_left.png',
    right: '/fish2_right.png',
  },
    fish3: {
    full: '/fish3.png',
    left: '/fish3_left.png',
    right: '/fish3_right.png',
  },
      car3: {
    full: '/car3.png',
    left: '/car3_left.png',
    right: '/car3_right.png',
  },
};

// Initial puzzle data (increased variety)
export const initialPuzzles = [
  { id: 'puzzle1', type: 'car1', correctHalf: 'right', options: ['car1_right', 'fish1_right', 'car2_right'] },
  { id: 'puzzle2', type: 'fish1', correctHalf: 'right', options: ['fish1_right', 'car1_right', 'fish2_right'] },
  { id: 'puzzle3', type: 'car2', correctHalf: 'right', options: ['car2_right', 'fish2_right', 'fish1_right'] },
  { id: 'puzzle4', type: 'fish2', correctHalf: 'right', options: ['fish2_right', 'car2_right', 'car1_right'] },
  { id: 'puzzle5', type: 'car3', correctHalf: 'right', options: ['car3_right', 'fish3_right', 'fish1_right'] },
  { id: 'puzzle6', type: 'fish3', correctHalf: 'right', options: ['fish3_right', 'car3_right', 'car1_right'] },
];
