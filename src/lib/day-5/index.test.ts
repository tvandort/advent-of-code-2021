import test from 'ava';
import { createInputGetter } from '../input';
import {
  countPoints,
  parseVector,
  Point,
  pointsOnVector,
  pointsThatAppearMoreThanOnce,
  Vector,
} from '.';

const input = createInputGetter(__dirname);
const example = input('example.txt');
const actual = input('actual.txt');

test('string to vector with points', (t) => {
  t.deepEqual(parseVector('0,9 -> 5,9'), {
    from: {
      x: 0,
      y: 9,
    },
    to: {
      x: 5,
      y: 9,
    },
  });
});

test('that a horizontal zero length vector is correct', (t) => {
  const vector: Vector = { from: { x: 0, y: 0 }, to: { x: 1, y: 0 } };
  t.deepEqual(pointsOnVector(vector), [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
  ]);
});

test('that a vertical zero length vector is correct', (t) => {
  const vector: Vector = { from: { x: 0, y: 0 }, to: { x: 0, y: 1 } };
  t.deepEqual(pointsOnVector(vector), [
    { x: 0, y: 0 },
    { x: 0, y: 1 },
  ]);
});

test('that points can be counted', (t) => {
  const points: Point[] = [
    { x: 0, y: 0 },
    { x: 1, y: 1 },
    { x: 1, y: 1 },
  ];

  t.deepEqual(countPoints(points), [
    {
      count: 1,
      key: '(0,0)',
      point: {
        x: 0,
        y: 0,
      },
    },
    {
      count: 2,
      key: '(1,1)',
      point: {
        x: 1,
        y: 1,
      },
    },
  ]);
});

test('example for points > 1', async (t) => {
  t.is(await pointsThatAppearMoreThanOnce(example), 5);
});

test('points vector of length > 1', (t) => {
  const vec: Vector = { from: { x: 0, y: 9 }, to: { x: 5, y: 9 } };
  t.deepEqual(pointsOnVector(vec), [
    { x: 0, y: 9 },
    { x: 1, y: 9 },
    { x: 2, y: 9 },
    { x: 3, y: 9 },
    { x: 4, y: 9 },
    { x: 5, y: 9 },
  ]);
});

test('actual for points > 1', async (t) => {
  t.is(await pointsThatAppearMoreThanOnce(actual), 3990);
});
