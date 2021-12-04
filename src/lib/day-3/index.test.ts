import test from 'ava';
import { createInputGetter } from '../input';
import { powerConsumption } from '.';

const input = createInputGetter(__dirname);

test('example power consumption', async (t) => {
  t.is(await powerConsumption(input('./example.txt')), 198);
});

test('actual power consumption', async (t) => {
  t.is(await powerConsumption(input('./actual.txt')), 198);
});
