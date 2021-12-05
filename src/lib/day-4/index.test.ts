import test from 'ava';
import { createInputGetter } from '../input';
import {
  lineToCalls,
  toBoard,
  extract,
  toGame,
  score,
  lastToWinScore,
} from '.';

const input = createInputGetter(__dirname);
const example = input('example.txt');
const actual = input('actual.txt');

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

test('given a string with calls and one table we can produce those', (t) => {
  const lines = [
    '1,2,3',
    '',
    '1 2 3 4 5',
    '6 7 8 9 10',
    '11 12 13 14 15',
    '16 17 18 19 20',
    '21 22 23 24 25',
  ];

  t.deepEqual(extract(lines), {
    calls: [1, 2, 3],
    boards: [
      [
        [1, 2, 3, 4, 5],
        [6, 7, 8, 9, 10],
        [11, 12, 13, 14, 15],
        [16, 17, 18, 19, 20],
        [21, 22, 23, 24, 25],
      ],
    ],
  });
});

test('score', (t) => {
  const board = toBoard([
    [1, 1],
    [2, 10],
  ]);

  board.mark(1);

  t.is(board.score(), 12);
});

test('can construct a game', (t) => {
  const lines = [
    '1,2,3',
    '',
    '1 2 3 4 5',
    '6 7 8 9 10',
    '11 12 13 14 15',
    '16 17 18 19 20',
    '21 22 23 24 25',
    '',
    '26 27 28 29 30',
    '32 33 34 35 36',
    '38 39 40 41 42',
    '43 44 45 46 47',
    '48 49 50 51 52',
  ];

  const extracted = toGame(extract(lines).boards);

  t.snapshot(extracted);
});

test('game can be won', (t) => {
  const lines = [
    '1,2,3',
    '',
    '1 2 3 4 5',
    '6 7 8 9 10',
    '11 12 13 14 15',
    '16 17 18 19 20',
    '21 22 23 24 25',
    '',
    '26 27 28 29 30',
    '32 33 34 35 36',
    '38 39 40 41 42',
    '43 44 45 46 47',
    '48 49 50 51 52',
  ];

  const game = toGame(extract(lines).boards);

  t.false(game.hasWinner());
  game.mark(1);

  t.false(game.hasWinner());
  game.mark(2);

  t.false(game.hasWinner());
  game.mark(3);

  t.false(game.hasWinner());
  game.mark(4);

  t.false(game.hasWinner());
  game.mark(5);

  t.true(game.hasWinner());
});

test('example', async (t) => {
  t.is(await score(example), 4512);
});

test('actual', async (t) => {
  t.is(await score(actual), 63552);
});

test('example last to win score', async (t) => {
  t.is(await lastToWinScore(example), 1924);
});

test('actual last to win score', async (t) => {
  t.is(await lastToWinScore(actual), 9020);
});
