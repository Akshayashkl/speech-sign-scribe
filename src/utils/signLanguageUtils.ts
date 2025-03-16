
export interface SignGesture {
  id: string;
  name: string;
  handPositions: HandPosition[];
  duration: number;
}

export interface HandPosition {
  palm: PalmPosition;
  fingers: FingerPosition[];
  rotation: Rotation;
}

export interface PalmPosition {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface FingerPosition {
  x: number;
  y: number;
  rotation: number;
  length: number;
  width: number;
}

export interface Rotation {
  x: number;
  y: number;
  z: number;
}

// Basic sign language gestures mapped to letters
const basicSignGestures: Record<string, SignGesture> = {
  'A': {
    id: 'sign-a',
    name: 'A',
    duration: 500,
    handPositions: [{
      palm: { x: 50, y: 60, width: 40, height: 60 },
      fingers: [
        { x: 70, y: 40, rotation: 0, length: 20, width: 8 },
        { x: 75, y: 30, rotation: 0, length: 25, width: 8 },
        { x: 80, y: 30, rotation: 0, length: 25, width: 8 },
        { x: 85, y: 30, rotation: 0, length: 25, width: 8 },
        { x: 90, y: 50, rotation: -30, length: 20, width: 8 },
      ],
      rotation: { x: 0, y: 0, z: 0 }
    }]
  },
  'B': {
    id: 'sign-b',
    name: 'B',
    duration: 500,
    handPositions: [{
      palm: { x: 50, y: 60, width: 40, height: 60 },
      fingers: [
        { x: 70, y: 10, rotation: 0, length: 30, width: 8 },
        { x: 75, y: 10, rotation: 0, length: 30, width: 8 },
        { x: 80, y: 10, rotation: 0, length: 30, width: 8 },
        { x: 85, y: 10, rotation: 0, length: 30, width: 8 },
        { x: 90, y: 50, rotation: -30, length: 20, width: 8 },
      ],
      rotation: { x: 0, y: 0, z: 0 }
    }]
  },
  'C': {
    id: 'sign-c',
    name: 'C',
    duration: 500,
    handPositions: [{
      palm: { x: 50, y: 60, width: 40, height: 60 },
      fingers: [
        { x: 70, y: 20, rotation: -30, length: 25, width: 8 },
        { x: 75, y: 15, rotation: -15, length: 25, width: 8 },
        { x: 80, y: 15, rotation: 0, length: 25, width: 8 },
        { x: 85, y: 20, rotation: 15, length: 25, width: 8 },
        { x: 90, y: 30, rotation: 30, length: 20, width: 8 },
      ],
      rotation: { x: 0, y: 0, z: 0 }
    }]
  },
};

export const getSignGestureForLetter = (letter: string): SignGesture | null => {
  const upperLetter = letter.toUpperCase();
  return basicSignGestures[upperLetter] || null;
};

export const getSignGesturesForWord = (word: string): SignGesture[] => {
  return word.split('').map(letter => {
    return getSignGestureForLetter(letter) || {
      id: `sign-unknown-${letter}`,
      name: letter,
      duration: 500,
      handPositions: [{
        palm: { x: 50, y: 60, width: 40, height: 60 },
        fingers: [
          { x: 70, y: 40, rotation: 0, length: 20, width: 8 },
          { x: 75, y: 30, rotation: 0, length: 25, width: 8 },
          { x: 80, y: 30, rotation: 0, length: 25, width: 8 },
          { x: 85, y: 30, rotation: 0, length: 25, width: 8 },
          { x: 90, y: 50, rotation: -30, length: 20, width: 8 },
        ],
        rotation: { x: 0, y: 0, z: 0 }
      }]
    };
  });
};

// More complex implementation would include animation transitions between letters
// This is a simplified version for demonstration purposes
