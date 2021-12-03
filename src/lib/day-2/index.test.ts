import test from 'ava';

import input from '../input';
import { aimCalculator, position, positionWithAim } from '.';

test('example', async (t) => {
  t.is(await position(input(__dirname, './example.txt')), 150);
});

test('actual', async (t) => {
  t.is(await position(input(__dirname, './actual.txt')), 1868935);
});

test('window example', async (t) => {
  t.is(await positionWithAim(input(__dirname, './example.txt')), 900);
});

test('window actual', async (t) => {
  t.is(await positionWithAim(input(__dirname, './actual.txt')), 1965970888);
});

test('forward with aimCalculator', (t) => {
  const start = { horizontal: 5, depth: 5, aim: 5 };
  t.deepEqual(aimCalculator.forward(start, 8), {
    aim: 5,
    depth: 45,
    horizontal: 13,
  });
});

test('up with aimCalculator', (t) => {
  const start = { horizontal: 1, depth: 1, aim: 1 };
  t.deepEqual(aimCalculator.up(start, 1), {
    aim: 0,
    depth: 1,
    horizontal: 1,
  });
});

test('down with aimCalculator', (t) => {
  const start = { horizontal: 0, depth: 0, aim: 0 };
  t.deepEqual(aimCalculator.down(start, 1), {
    aim: 1,
    depth: 0,
    horizontal: 0,
  });
});
