import test from 'ava';
import { createInputGetter } from '../input';
import {
  bestConsumptionFromFile,
  bestFlatConsumption,
  bestScalingConsumptionFromFile,
  calculateFlatFuelConsumption,
  calculateScalingConsumption,
} from '.';

const input = createInputGetter(__dirname);
const example = input('example.txt');
const actual = input('actual.txt');

test('example numbers', (t) => {
  t.is(bestFlatConsumption([16, 1, 2, 0, 4, 2, 7, 1, 2, 14]), 37);
});

test('fuel consumption', (t) => {
  t.is(calculateFlatFuelConsumption([16], 2), 14);
});

test('example file part 1', async (t) => {
  t.is(await bestConsumptionFromFile(example), 37);
});

test('actual file part 1', async (t) => {
  t.is(await bestConsumptionFromFile(actual), 345035);
});

test('scaling calculation', (t) => {
  t.is(calculateScalingConsumption([16], 5), 66);
});

test('scaling calculation more', (t) => {
  t.is(calculateScalingConsumption([16, 1, 2, 0, 4, 2, 7, 1, 2, 14], 5), 168);
});

test('example scaling', async (t) => {
  t.is(await bestScalingConsumptionFromFile(example), 168);
});

test('actual scaling', async (t) => {
  t.is(await bestScalingConsumptionFromFile(actual), 97038163);
});
