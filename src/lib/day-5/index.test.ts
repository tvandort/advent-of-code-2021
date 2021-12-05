import test from 'ava';
import { createInputGetter } from '../input';
import {} from '.';

const input = createInputGetter(__dirname);
const example = input('example.txt');
const actual = input('actual.txt');

test('that we can parse the call line', (t) => {
  t.true(false);
});
