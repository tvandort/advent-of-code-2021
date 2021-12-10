import { readToArray } from '../readToArray';

export interface Point {
  x: number;
  y: number;
}

export interface Vector {
  from: Point;
  to: Point;
}

function parsePoint(pointString: string) {
  const [x, y] = pointString.split(',');
  return {
    x: parseInt(x),
    y: parseInt(y),
  };
}

export function parseVector(vectorString: string) {
  const [leftString, rightString] = vectorString.split('->');
  const left = parsePoint(leftString);
  const right = parsePoint(rightString);

  return {
    from: left,
    to: right,
  };
}

export function axialPointsOnVector(vector: Vector): Point[] {
  const points: Point[][] = [];

  const xNormal = Math.sign(vector.to.x - vector.from.x);
  const yNormal = Math.sign(vector.to.y - vector.from.y);

  if (xNormal === 0 || yNormal === 0) {
    points.push(pointsOnVector(vector));
  }

  return points.flatMap((points) => points);
}

type PointKey = `(${number},${number})`;

interface PointCounter {
  key: PointKey;
  count: number;
  point: Point;
}

export function pointsOnVector(vector: Vector) {
  const points: Point[] = [];
  const xNormal = Math.sign(vector.to.x - vector.from.x);
  const yNormal = Math.sign(vector.to.y - vector.from.y);
  let start = vector.from;
  do {
    points.push(start);
    start = {
      x: start.x + xNormal,
      y: start.y + yNormal,
    };
  } while (start.x !== vector.to.x || start.y !== vector.to.y);
  points.push(vector.to);
  return points;
}

export function countPoints(points: Point[]) {
  const pointsMap: { [index: PointKey]: PointCounter } = {};
  const pointsArray: PointCounter[] = [];

  for (const point of points) {
    const key: PointKey = `(${point.x},${point.y})`;
    if (pointsMap[key]) {
      const counter = pointsMap[key];
      counter.count += 1;
    } else {
      const counter: PointCounter = {
        key,
        count: 1,
        point,
      };
      pointsMap[key] = counter;
      pointsArray.push(counter);
    }
  }

  return pointsArray;
}

async function countWith(
  filePath: string,
  pointsOn: (vector: Vector) => Point[]
) {
  const points = (await readToArray(filePath, (line) => parseVector(line)))
    .map((vector) => pointsOn(vector))
    .flatMap((points) => points);
  return countPoints(points).filter((point) => point.count > 1).length;
}

export async function countAxialPointsThatAppearMoreThanOnce(filePath: string) {
  return countWith(filePath, axialPointsOnVector);
}

export async function countPointsThatAppearMoreThanOnce(filePath: string) {
  return countWith(filePath, pointsOnVector);
}
