import { readToArray } from '../readToArray';

export async function countIncreases(filePath: string, windowSize = 1) {
  const data = await readToArray(filePath, (line) => parseInt(line));

  let increases = 0;
  for (let index = 0; index < data.length; index++) {
    if (index + windowSize < data.length) {
      const last = data.slice(index, index + windowSize);
      const lastSum = last.reduce((previous, current) => previous + current, 0);

      const current = data.slice(index + 1, index + windowSize + 1);
      const currentSum = current.reduce(
        (previous, current) => previous + current,
        0
      );

      if (currentSum > lastSum) {
        increases++;
      }
    }
  }

  return increases;
}
