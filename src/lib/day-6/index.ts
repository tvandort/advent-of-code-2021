import { readToArray } from '../readToArray';

interface FishCountMap {
  [key: string]: number;
}

export class FishCounter {
  #counts: FishCountMap = FishCountMap();

  constructor(fishes: number[] = []) {
    for (const fish of fishes) {
      this.#counts[fish] += 1;
    }
  }

  fishOnCycle(day: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8) {
    return this.#counts[day];
  }

  incrementBy(days: number) {
    for (let day = 0; day < days; day++) {
      const nextCount = FishCountMap();
      for (let cycle = 0; cycle < 9; cycle++) {
        if (cycle === 0) {
          nextCount[8] = this.#counts[cycle];
          nextCount[6] = this.#counts[cycle];
        } else {
          nextCount[cycle - 1] += this.#counts[cycle];
        }
      }
      this.#counts = nextCount;
    }
  }

  sum() {
    let sum = 0;
    for (let day = 0; day < 9; day++) {
      sum += this.#counts[day];
    }
    return sum;
  }
}

function FishCountMap(): FishCountMap {
  return {
    '8': 0,
    '7': 0,
    '6': 0,
    '5': 0,
    '4': 0,
    '3': 0,
    '2': 0,
    '1': 0,
    '0': 0,
  };
}

export function incrementEfficient(fishes: number[]) {
  const counts: { [key: string]: number } = {
    '8': 0,
    '7': 0,
    '6': 0,
    '5': 0,
    '4': 0,
    '3': 0,
    '2': 0,
    '1': 0,
    '0': 0,
  };

  for (const fish of fishes) {
    counts[fish - 1] += 1;
  }

  return counts;
}

export async function incrementFish(filePath: string, days: number) {
  const fish = (await readToArray(filePath, (line) => line))[0]
    .split(',')
    .map((stringNumber) => parseInt(stringNumber));

  const counter = new FishCounter(fish);
  counter.incrementBy(days);

  return counter.sum();
}
