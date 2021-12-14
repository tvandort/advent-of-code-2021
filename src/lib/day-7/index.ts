import { readToArray } from '../readToArray';

interface FuelCalculator {
  (positions: number[], moveTo: number): number;
}

export function calculateFlatFuelConsumption(
  positions: number[],
  moveTo: number
) {
  let currentFuelConsumption = 0;
  for (const position of positions) {
    currentFuelConsumption += Math.abs(moveTo - position);
  }

  return currentFuelConsumption;
}

export function calculateScalingConsumption(
  positions: number[],
  moveTo: number
) {
  let currentFuelConsumption = 0;
  for (const position of positions) {
    const consumption = triangleNumber(moveTo, position);
    currentFuelConsumption += consumption;
  }

  return currentFuelConsumption;
}

// Factorial but addition instead of multiplication.
function triangleNumber(moveTo: number, position: number) {
  const n = Math.abs(moveTo - position);
  const consumption = (Math.pow(n, 2) + n) / 2;
  return consumption;
}

export function bestConsumption(
  positions: number[],
  fuelConsumptionMethod: FuelCalculator
) {
  const minPosition = Math.min(...positions);
  const maxPosition = Math.max(...positions);

  let lowestFuelConsumption = Number.MAX_VALUE;
  for (
    let possiblePosition = minPosition;
    possiblePosition <= maxPosition;
    possiblePosition++
  ) {
    const currentFuelConsumption = fuelConsumptionMethod(
      positions,
      possiblePosition
    );
    if (currentFuelConsumption < lowestFuelConsumption) {
      lowestFuelConsumption = currentFuelConsumption;
    }
  }

  return lowestFuelConsumption;
}

export function bestFlatConsumption(positions: number[]) {
  return bestConsumption(positions, calculateFlatFuelConsumption);
}

export async function bestConsumptionFromFile(filePath: string) {
  const line = (await readToArray(filePath, (line) => line))[0]
    .split(',')
    .map((number) => parseInt(number));

  return bestConsumption(line, calculateFlatFuelConsumption);
}

export async function bestScalingConsumptionFromFile(filePath: string) {
  const line = (await readToArray(filePath, (line) => line))[0]
    .split(',')
    .map((number) => parseInt(number));

  return bestConsumption(line, calculateScalingConsumption);
}
