import { readToArray } from '../readToArray';

export function lineToCalls(line: string) {
  return line.split(',').map((number) => parseInt(number));
}

class Position {
  readonly x: number;
  readonly y: number;
  readonly value: number;
  #marked = false;

  constructor({ x, y, value }: { x: number; y: number; value: number }) {
    this.x = x;
    this.y = y;
    this.value = value;
  }

  mark() {
    this.#marked = true;
  }

  get isMarked() {
    return this.#marked;
  }
}

class BoardNumber {
  readonly value: number;
  #positions: Position[] = [];

  constructor(value: number) {
    this.value = value;
  }

  add(position: Position) {
    this.#positions.push(position);
  }

  mark() {
    this.#positions.forEach((position) => {
      position.mark();
    });
  }
}

interface BoardNumberMap {
  [index: number]: BoardNumber;
}

class BoardNumbers {
  #values: BoardNumberMap = {};

  of(value: number): BoardNumber | undefined {
    return this.#values[value];
  }

  add(value: BoardNumber) {
    this.#values[value.value] = value;
  }

  mark(value: number) {
    this.#values[value].mark();
  }
}

interface CellXyArgs {
  x: number;
  y: number;
}

interface CellPositionArgs {
  position: Position;
}

function isCellPositionArg(args: CellKeyArgs): args is CellPositionArgs {
  return (args as CellPositionArgs).position !== undefined;
}

type CellKeyArgs = CellXyArgs | CellPositionArgs;

function cellKey(args: CellKeyArgs) {
  if (isCellPositionArg(args)) {
    return `(${args.position.x},${args.position.y})`;
  } else {
    return `(${args.x},${args.y})`;
  }
}

class Board {
  readonly #values: BoardNumbers;
  readonly #cells: Cells;
  readonly #dimension: number;

  constructor({
    values,
    cells,
    dimension,
  }: {
    values: BoardNumbers;
    cells: Cells;
    dimension: number;
  }) {
    this.#values = values;
    this.#cells = cells;
    this.#dimension = dimension;
  }

  valueAt(x: number, y: number) {
    return this.#cells.of(x, y).value;
  }

  mark(value: number) {
    this.#values.of(value)?.mark();
  }

  isMarked(x: number, y: number) {
    return this.#cells.of(x, y).isMarked;
  }

  hasWon() {
    for (let x = 0; x < this.#dimension; x++) {
      let columnCompleted = true;
      for (let y = 0; y < this.#dimension; y++) {
        columnCompleted = columnCompleted && this.isMarked(x, y);
      }
      if (columnCompleted) {
        return true;
      }
    }

    for (let y = 0; y < this.#dimension; y++) {
      let rowCompleted = true;
      for (let x = 0; x < this.#dimension; x++) {
        rowCompleted = rowCompleted && this.#cells.of(x, y).isMarked;
      }
      if (rowCompleted) {
        return true;
      }
    }

    return false;
  }

  score() {
    return this.#cells.score();
  }
}

interface CellMap {
  [index: string]: Position;
}

class Cells {
  #cells: CellMap;
  #cellsArray: Position[];

  constructor({
    cells,
    cellsArray,
  }: {
    cells: CellMap;
    cellsArray: Position[];
  }) {
    this.#cells = cells;
    this.#cellsArray = cellsArray;
  }

  of(x: number, y: number) {
    const cell = this.#cells[cellKey({ x, y })];
    if (!cell) {
      throw new Error(`${cellKey({ x, y })} not found`);
    }
    return cell;
  }

  score() {
    return this.#cellsArray
      .filter((cell) => !cell.isMarked)
      .map((cell) => cell.value)
      .reduce((accumulator, next) => accumulator + next, 0);
  }
}

export function extract(lines: string[]) {
  const boards: number[][][] = [];
  let nextBoard: number[][] = [];
  for (let index = 2; index < lines.length; index++) {
    const line = lines[index];

    if (line !== '') {
      nextBoard.push(
        line
          .split(' ')
          .filter((item) => item.trim().length > 0)
          .map((number) => parseInt(number))
      );
    }

    if (line === '' || index === lines.length - 1) {
      boards.push(nextBoard);
      nextBoard = [];
    }
  }

  return {
    calls: lines[0].split(',').map((number) => parseInt(number)),
    boards,
  };
}

export function toBoard(lines: number[][]): Board {
  const allCells = lines
    .map((line, y) =>
      line.map(
        (value, x) =>
          new Position({
            x,
            y,
            value,
          })
      )
    )
    .flatMap((x) => x);

  const cellMap: CellMap = {};
  for (const cell of allCells) {
    cellMap[cellKey(cell)] = cell;
  }

  const values: BoardNumbers = new BoardNumbers();
  for (const cell of allCells) {
    let cells = values.of(cell.value);
    if (cells) {
      cells.add(cell);
    } else {
      values.add((cells = new BoardNumber(cell.value)));
      cells.add(cell);
    }
  }

  return new Board({
    cells: new Cells({ cells: cellMap, cellsArray: allCells }),
    values,
    dimension: lines[0].length,
  });
}

export function toGame(boards: ReturnType<typeof extract>['boards']) {
  return new Game(boards.map((lines) => toBoard(lines)));
}

class Game {
  #boards: Board[];
  #finishedBoards: Board[] = [];

  constructor(boards: Board[]) {
    this.#boards = boards;
  }

  mark(number: number) {
    this.#boards.forEach((board) => board.mark(number));
  }

  hasWinner() {
    return this.#boards.some((board) => board.hasWon());
  }

  winningBoard() {
    return this.#boards.filter((board) => board.hasWon())[0];
  }

  hasFinished() {
    const finished = this.#boards.filter((board) => board.hasWon());
    for (const board of finished) {
      if (!this.#finishedBoards.includes(board)) {
        this.#finishedBoards.push(board);
      }
    }

    return this.#boards.every((board) => board.hasWon());
  }

  mostRecentlyCompletedBoard() {
    return this.#finishedBoards[this.#finishedBoards.length - 1];
  }
}

export async function score(filePath: string) {
  const { calls, game } = await readGame(filePath);

  for (const call of calls) {
    game.mark(call);
    if (game.hasWinner()) {
      return call * game.winningBoard().score();
    }
  }

  throw new Error('No winner.');
}

async function readGame(filePath: string) {
  const lines = await readToArray(filePath, (line) => line);
  const extracted = extract(lines);
  const game = toGame(extracted.boards);

  return { game, calls: extracted.calls };
}

export async function lastToWinScore(filePath: string) {
  const { calls, game } = await readGame(filePath);

  for (const call of calls) {
    game.mark(call);
    if (game.hasFinished()) {
      return call * game.mostRecentlyCompletedBoard().score();
    }
  }

  throw new Error('There are boards that are still incomplete.');
}
