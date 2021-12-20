import test from 'ava';
import { createInputGetter } from '../input';
import {
  countOneFourSevenEight,
  detectEight,
  detectFour,
  detectOne,
  detectSeven,
  determineNumbers,
} from '.';

const input = createInputGetter(__dirname);
const example = input('example.txt');
const actual = input('actual.txt');

test('detects one', (t) => {
  t.true(detectOne('ab'));
});

test('detects four', (t) => {
  t.true(detectFour('abcd'));
});

test('detects seven', (t) => {
  t.true(detectSeven('abc'));
});

test('detects eight', (t) => {
  t.true(detectEight('gbdfcae'));
});

test('detects easy numbers', async (t) => {
  t.is(await countOneFourSevenEight(example), 26);
});

test('actual part 1', async (t) => {
  t.is(await countOneFourSevenEight(actual), 521);
});

test('numbers from', (t) => {
  t.is(
    determineNumbers({
      input: [
        'acedgfb',
        'cdfbe',
        'gcdfa',
        'fbcad',
        'dab',
        'cefabd',
        'cdfgeb',
        'eafb',
        'cagedb',
        'ab',
      ],
      output: ['cdfeb', 'fcadb', 'cdfeb', 'cdbaf'],
    }),
    5353
  );
});
