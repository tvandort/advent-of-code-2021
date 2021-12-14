import test from 'ava';
import { createInputGetter } from '../input';
import {
  bestConsumption,
  bestConsumptionFromFile,
  calculateFuelConsumption,
} from '.';

const input = createInputGetter(__dirname);
const example = input('example.txt');
const actual = input('actual.txt');

test('example numbers', (t) => {
  t.is(bestConsumption([16, 1, 2, 0, 4, 2, 7, 1, 2, 14]), 37);
});

test('fuel consumption', (t) => {
  t.is(calculateFuelConsumption([16], 2), 14);
});

test('example file part 1', async (t) => {
  t.is(await bestConsumptionFromFile(example), 37);
});

test('actual file part 1', async (t) => {
  t.is(await bestConsumptionFromFile(actual), 345035);
});
