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

class Value {
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

interface ValueMap {
  [index: number]: Value;
}

class Values {
  #values: ValueMap = {};

  of(value: number): Value {
    return this.#values[value];
  }

  add(value: Value) {
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
    return `(${args.position.x},${args.position.y}))`;
  } else {
    return `(${args.x},${args.y}))`;
  }
}

class Board {
  readonly #values: Values;
  readonly #cells: Cells;
  readonly #dimension: number;

  constructor({
    values,
    cells,
    dimension,
  }: {
    values: Values;
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
    this.#values.of(value).mark();
  }

  isMarked(x: number, y: number) {
    return this.#cells.of(x, y).isMarked;
  }

  hasWon() {
    for (let x = 0; x < this.#dimension; x++) {
      let columnCompleted = true;
      for (let y = 0; y < this.#dimension; y++) {
        columnCompleted = columnCompleted && this.#cells.of(x, y).isMarked;
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
}

interface CellMap {
  [index: string]: Position;
}

class Cells {
  #cells: CellMap;

  constructor(cells: CellMap) {
    this.#cells = cells;
  }

  of(x: number, y: number) {
    return this.#cells[cellKey({ x, y })];
  }
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

  const values: Values = new Values();
  for (const cell of allCells) {
    let cells: Value;
    if (values.of(cell.value)) {
      cells = values.of(cell.value);
    } else {
      values.add((cells = new Value(cell.value)));
    }
    cells.add(cell);
  }

  return new Board({
    cells: new Cells(cellMap),
    values,
    dimension: lines[0].length,
  });
}

export function score() {}
