import test from 'ava';
import { createInputGetter } from '../input';
import { lifeSupport, powerConsumption } from '.';

const input = createInputGetter(__dirname);

test('example power consumption', async (t) => {
  t.is(await powerConsumption(input('./example.txt')), 198);
});

test('actual power consumption', async (t) => {
  t.is(await powerConsumption(input('./actual.txt')), 3885894);
});

test('example life support', async (t) => {
  t.is(await lifeSupport(input('./example.txt')), 230);
});

test('actual life support', async (t) => {
  t.is(await lifeSupport(input('./actual.txt')), 4375225);
});
