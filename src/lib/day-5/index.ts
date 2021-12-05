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

export function pointsOnVector(vector: Vector): Point[] {
  const points: Point[] = [];

  if (vector.from.x === vector.to.x && vector.from.y !== vector.to.y) {
    const minY = Math.min(vector.from.y, vector.to.y);
    const maxY = Math.max(vector.from.y, vector.to.y);
    for (let vertical = minY; vertical <= maxY; vertical++) {
      points.push({ x: vector.from.x, y: vertical });
    }
  }

  if (vector.from.x !== vector.to.x && vector.from.y === vector.to.y) {
    const minX = Math.min(vector.from.x, vector.to.x);
    const maxX = Math.max(vector.from.x, vector.to.x);

    for (let horizontal = minX; horizontal <= maxX; horizontal++) {
      points.push({ x: horizontal, y: vector.from.y });
    }
  }

  return points;
}

type PointKey = `(${number},${number})`;

interface PointCounter {
  key: PointKey;
  count: number;
  point: Point;
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

export async function pointsThatAppearMoreThanOnce(filePath: string) {
  const points = (
    await readToArray(filePath, (line) => pointsOnVector(parseVector(line)))
  ).flatMap((points) => points);

  const counted = countPoints(points);

  return counted
    .map((p) => {
      return p;
    })
    .filter((point) => point.count > 1)
    .map((p) => {
      return p;
    }).length;
}
