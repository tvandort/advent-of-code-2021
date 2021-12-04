import { readToArray } from '../readToArray';

export async function powerConsumption(filePath: string) {
  const data = await readToArray(filePath, (line) => line);
  const length = data[0].length;

  const counts: number[] = new Array(length).fill(0);
  for (const reading of data) {
    for (let index = 0; index < reading.length; index++) {
      counts[index] = counts[index] + parseInt(reading[index]);
    }
  }

  const gammaArray = counts.map((count) =>
    count > data.length / 2 ? '1' : '0'
  );
  const epsilonArray = gammaArray.map((bit) => (bit === '1' ? '0' : '1'));

  const gamma = parseInt(gammaArray.join(''), 2);
  const epsilon = parseInt(epsilonArray.join(''), 2);

  return gamma * epsilon;
}
