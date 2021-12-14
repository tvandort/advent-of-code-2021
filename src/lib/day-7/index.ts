import { readToArray } from '../readToArray';

export function calculateFuelConsumption(positions: number[], moveTo: number) {
  let currentFuelConsumption = 0;
  for (const position of positions) {
    currentFuelConsumption += Math.abs(moveTo - position);
  }

  return currentFuelConsumption;
}

export function bestConsumption(positions: number[]) {
  const minPosition = Math.min(...positions);
  const maxPosition = Math.max(...positions);

  let lowestFuelConsumption = Number.MAX_VALUE;
  for (
    let possiblePosition = minPosition;
    possiblePosition <= maxPosition;
    possiblePosition++
  ) {
    const currentFuelConsumption = calculateFuelConsumption(
      positions,
      possiblePosition
    );
    if (currentFuelConsumption < lowestFuelConsumption) {
      lowestFuelConsumption = currentFuelConsumption;
    }
  }

  return lowestFuelConsumption;
}

export async function bestConsumptionFromFile(filePath: string) {
  const line = (await readToArray(filePath, (line) => line))[0]
    .split(',')
    .map((number) => parseInt(number));

  return bestConsumption(line);
}
