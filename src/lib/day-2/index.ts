import { readToArray } from '../readToArray';

const up = 'up' as const;
const down = 'down' as const;
const forward = 'forward' as const;

const directions = [up, down, forward] as const;
const untypedDirections = directions.map((direction) => direction as string);
type Direction = typeof directions[number];
type Magnitude = number;

function isOfTypeDirection(
  potentialDirection: string
): potentialDirection is Direction {
  return untypedDirections.includes(potentialDirection);
}

interface Vector {
  direction: Direction;
  magnitude: Magnitude;
}

interface Location {
  horizontal: number;
  depth: number;
  aim: number;
}

interface Change {
  (currentLocation: Location, magnitude: Vector['magnitude']): Location;
}

interface Calculator {
  forward: Change;
  up: Change;
  down: Change;
}

export const calculator: Calculator = {
  forward: ({ depth, horizontal }, magnitude) => {
    return { depth, horizontal: horizontal + magnitude, aim: 0 };
  },
  up: ({ depth, horizontal }, magnitude) => {
    return { depth: depth - magnitude, horizontal, aim: 0 };
  },
  down: ({ depth, horizontal }, magnitude) => {
    return { depth: depth + magnitude, horizontal, aim: 0 };
  },
};

export const aimCalculator: Calculator = {
  forward: ({ depth, horizontal, aim }, magnitude) => {
    return {
      depth: depth + magnitude * aim,
      horizontal: horizontal + magnitude,
      aim,
    };
  },
  up: ({ depth, horizontal, aim }, magnitude) => {
    return { depth, horizontal, aim: aim - magnitude };
  },
  down: ({ depth, horizontal, aim }, magnitude) => {
    return { depth, horizontal, aim: aim + magnitude };
  },
};

function createPositionCalculator(
  calculator: Calculator
): (filePath: string) => Promise<number> {
  return async (filePath: string) => {
    const data = await readToArray(filePath, toVector);
    let location: Location = { depth: 0, horizontal: 0, aim: 0 };
    for (const vector of data) {
      switch (vector.direction) {
        case up: {
          location = calculator.up(location, vector.magnitude);
          break;
        }
        case down: {
          location = calculator.down(location, vector.magnitude);
          break;
        }
        case forward: {
          location = calculator.forward(location, vector.magnitude);
          break;
        }
      }
    }

    return location.depth * location.horizontal;
  };
}

export async function position(filePath: string) {
  return await createPositionCalculator(calculator)(filePath);
}

export async function positionWithAim(filePath: string) {
  return await createPositionCalculator(aimCalculator)(filePath);
}

function toVector(line: string): Vector {
  const [direction, magnitude] = line.split(' ');

  if (!isOfTypeDirection(direction)) {
    throw Error('Incorrect direction.');
  }

  return {
    direction,
    magnitude: parseInt(magnitude),
  };
}
