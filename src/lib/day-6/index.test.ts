import test from 'ava';
import { createInputGetter } from '../input';
import { FishCounter, incrementFish } from '.';

const input = createInputGetter(__dirname);
const example = input('example.txt');
const actual = input('actual.txt');

test('increments one day with one fish on 3 correctly', (t) => {
  const counter = new FishCounter([3]);
  t.is(counter.fishOnCycle(3), 1);

  counter.incrementBy(1);

  t.is(counter.fishOnCycle(3), 0);
  t.is(counter.fishOnCycle(2), 1);
});

test('increments on day with fish on day 0 correctly', (t) => {
  const counter = new FishCounter([0]);

  t.is(counter.fishOnCycle(0), 1);

  counter.incrementBy(1);

  t.is(counter.fishOnCycle(8), 1);
  t.is(counter.fishOnCycle(6), 1);
});

test('example input 18 days', async (t) => {
  t.is(await incrementFish(example, 18), 26);
});

test('example input 80 days', async (t) => {
  t.is(await incrementFish(example, 80), 5934);
});

test('actual 80 days', async (t) => {
  t.is(await incrementFish(actual, 80), 380243);
});

test('example 256', async (t) => {
  t.is(await incrementFish(example, 256), 26984457539);
});

test('actual 256', async (t) => {
  t.is(await incrementFish(actual, 256), 1708791884591);
});
