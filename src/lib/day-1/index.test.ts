import test from 'ava';

import input from '../input';
import { countIncreases } from '.';

test('example', async (t) => {
  t.is(await countIncreases(input(__dirname, './example.txt')), 7);
});

test('actual', async (t) => {
  t.is(await countIncreases(input(__dirname, './actual.txt')), 1466);
});

test('window example', async (t) => {
  t.is(await countIncreases(input(__dirname, './example.txt'), 3), 5);
});

test('window actual', async (t) => {
  t.is(await countIncreases(input(__dirname, './actual.txt'), 3), 1491);
});
