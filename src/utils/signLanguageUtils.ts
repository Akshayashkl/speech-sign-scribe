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
  isBent: boolean;
}

export interface Rotation {
  x: number;
  y: number;
  z: number;
}

const basicSignGestures: Record<string, SignGesture> = {
  'A': {
    id: 'sign-a',
    name: 'A',
    duration: 800,
    handPositions: [{
      palm: { x: 50, y: 50, width: 45, height: 65 },
      fingers: [
        { x: 70, y: 40, rotation: 0, length: 20, width: 8, isBent: true },
        { x: 75, y: 30, rotation: 0, length: 25, width: 8, isBent: true },
        { x: 80, y: 30, rotation: 0, length: 25, width: 8, isBent: true },
        { x: 85, y: 30, rotation: 0, length: 25, width: 8, isBent: true },
        { x: 90, y: 35, rotation: -20, length: 20, width: 8, isBent: true },
      ],
      rotation: { x: 0, y: 0, z: 0 }
    }]
  },
  'B': {
    id: 'sign-b',
    name: 'B',
    duration: 800,
    handPositions: [{
      palm: { x: 50, y: 50, width: 45, height: 65 },
      fingers: [
        { x: 70, y: 45, rotation: -30, length: 25, width: 8, isBent: false },
        { x: 75, y: 15, rotation: 0, length: 35, width: 8, isBent: false },
        { x: 80, y: 15, rotation: 0, length: 35, width: 8, isBent: false },
        { x: 85, y: 15, rotation: 0, length: 35, width: 8, isBent: false },
        { x: 90, y: 15, rotation: 0, length: 35, width: 8, isBent: false },
      ],
      rotation: { x: 0, y: 0, z: 0 }
    }]
  },
  'C': {
    id: 'sign-c',
    name: 'C',
    duration: 800,
    handPositions: [{
      palm: { x: 50, y: 50, width: 45, height: 65 },
      fingers: [
        { x: 70, y: 25, rotation: -45, length: 25, width: 8, isBent: false },
        { x: 75, y: 20, rotation: -30, length: 30, width: 8, isBent: true },
        { x: 80, y: 20, rotation: -15, length: 30, width: 8, isBent: true },
        { x: 85, y: 25, rotation: 0, length: 30, width: 8, isBent: true },
        { x: 90, y: 30, rotation: 15, length: 25, width: 8, isBent: true },
      ],
      rotation: { x: 0, y: 0, z: -15 }
    }]
  }
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
