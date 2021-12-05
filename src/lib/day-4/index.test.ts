import test from 'ava';
import { createInputGetter } from '../input';
import { lineToCalls, toBoard } from '.';

const input = createInputGetter(__dirname);
const example = input('example.txt');

test('that we can parse the call line', (t) => {
  t.deepEqual(lineToCalls('1,2,3'), [1, 2, 3]);
});

test('that we can get a cell', (t) => {
  t.is(toBoard([[1]]).valueAt(0, 0), 1);
});

test('is marked', (t) => {
  const board = toBoard([[1]]);
  board.mark(1);
  t.true(board.isMarked(0, 0));
});

test('is marked with a bigger board', (t) => {
  const board = toBoard([
    [1, 0],
    [0, 1],
  ]);

  board.mark(1);

  t.true(board.isMarked(0, 0));
  t.true(board.isMarked(1, 1));
  t.false(board.isMarked(0, 1));
  t.false(board.isMarked(1, 0));
});

test('that a 1 cell board wins when it is marked', (t) => {
  const board = toBoard([[1]]);
  board.mark(1);
  t.true(board.hasWon());
});

test('that a 4 cell board wins when horizontal is marked', (t) => {
  const board = toBoard([
    [1, 1],
    [0, 0],
  ]);

  board.mark(1);

  t.true(board.hasWon());
});

test('that a 4 cell board wins when a vertical is marked', (t) => {
  const board = toBoard([
    [1, 0],
    [1, 0],
  ]);

  board.mark(1);

  t.true(board.hasWon());
});

// test('that a position can be marked', (t) => {});

// test.skip('that we can get the first board', async (t) => {
//   t.deepEqual((await readBingoGame(example)).tables, [
//     {
//       rows: [0, 0, 0, 0, 0],
//       columns: [0, 0, 0, 0, 0],
//     },
//   ]);
// });
