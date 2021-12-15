import { readToArray } from '../readToArray';

export function detectOne(input: string) {
  return input.length === 2;
}

export function detectFour(input: string) {
  return input.length === 4;
}

export function detectSeven(input: string) {
  return input.length === 3;
}

export function detectEight(input: string) {
  return input.length === 7;
}

export async function countOneFourSevenEight(filePath: string) {
  const outputs = (
    await readToArray(filePath, (line) => line.split('|')[1].split(' '))
  ).flatMap((line) => line);

  return outputs.filter(
    (number) =>
      detectOne(number) ||
      detectFour(number) ||
      detectSeven(number) ||
      detectEight(number)
  ).length;
}
