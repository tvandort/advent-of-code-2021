import { readToArray } from '../readToArray';

export function increment(fish: number[]) {
  const newFish: number[] = [];
  const oldFish = fish.map((f) => {
    if (f === 0) {
      newFish.push(8);
      return 6;
    }
    return f - 1;
  });

  return [...oldFish, ...newFish];
}

export async function incrementFish(filePath: string, days: number) {
  let fish = (await readToArray(filePath, (line) => line))[0]
    .split(',')
    .map((stringNumber) => parseInt(stringNumber));

  for (let day = 0; day < days; day++) {
    fish = increment(fish);
  }

  return fish.length;
}
