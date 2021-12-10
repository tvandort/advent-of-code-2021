import test from 'ava';
import { createInputGetter } from '../input';
import { increment, incrementFish } from '.';

const input = createInputGetter(__dirname);
const example = input('example.txt');
const actual = input('actual.txt');

test('array of 1 increments correctly from one step', (t) => {
  t.deepEqual(increment([3]), [2]);
});

test('incrementing an array of 1 results in array of 0', (t) => {
  t.deepEqual(increment([1]), [0]);
});

test('incrememnting an array of 0 results in both a new fish and the existing fish reset', (t) => {
  t.deepEqual(increment([0]), [6, 8]);
});

test('example input 18 days', async (t) => {
  t.deepEqual(await incrementFish(example, 18), 26);
});

test('example input 80 days', async (t) => {
  t.deepEqual(await incrementFish(example, 80), 5934);
});

test('actual 80 days', async (t) => {
  t.deepEqual(await incrementFish(actual, 80), 380243);
});
