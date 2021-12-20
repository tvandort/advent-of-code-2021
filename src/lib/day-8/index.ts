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

interface Segment {
  top: string;
  bottom: string;
  topLeft: string;
  topRight: string;
  bottomLeft: string;
  bottomRight: string;
  center: string;
}

function includesExactly(number: string, lookFor: string[]) {
  return (
    lookFor.every((letter) => number.includes(letter)) &&
    number.split('').filter((letter) => !lookFor.includes(letter)).length === 0
  );
}

function isOne({ topRight, bottomRight }: Segment, number: string) {
  return includesExactly(number, [topRight, bottomRight]);
}

function isTwo(
  { top, topRight, center, bottomLeft, bottom }: Segment,
  number: string
) {
  return includesExactly(number, [top, topRight, center, bottom, bottomLeft]);
}

function isThree(
  { top, topRight, center, bottomRight, bottom }: Segment,
  number: string
) {
  return includesExactly(number, [top, topRight, center, bottomRight, bottom]);
}

function isFour(
  { topLeft, topRight, center, bottomRight }: Segment,
  number: string
) {
  return includesExactly(number, [topLeft, topRight, center, bottomRight]);
}

function isFive(
  { top, topLeft, center, bottomRight, bottom }: Segment,
  number: string
) {
  return includesExactly(number, [top, topLeft, center, bottomRight, bottom]);
}

function isSix(
  { top, topLeft, center, bottomRight, bottomLeft, bottom }: Segment,
  number: string
) {
  return includesExactly(number, [
    top,
    topLeft,
    center,
    bottomRight,
    bottomLeft,
    bottom,
  ]);
}

function isSeven({ top, topRight, bottomRight }: Segment, number: string) {
  return includesExactly(number, [top, topRight, bottomRight]);
}

function isEight(
  { top, topRight, bottom, center, topLeft, bottomLeft, bottomRight }: Segment,
  number: string
) {
  return includesExactly(number, [
    top,
    topRight,
    bottom,
    center,
    topLeft,
    bottomLeft,
    bottomRight,
  ]);
}

function isNine(
  { top, center, topRight, topLeft, bottomRight }: Segment,
  number: string
) {
  return includesExactly(number, [top, center, topRight, topLeft, bottomRight]);
}

function isZero(
  { top, bottom, bottomLeft, bottomRight, topLeft, topRight }: Segment,
  number: string
) {
  return includesExactly(number, [
    top,
    bottom,
    topRight,
    topLeft,
    bottomRight,
    bottomLeft,
  ]);
}

export function determineNumbers({
  input,
  output,
}: {
  input: string[];
  output: string[];
}) {
  const oneSegmentLetters = input.filter(detectOne);
  if (oneSegmentLetters.length > 0) {
    const [tr, br] = oneSegmentLetters[0].split('');
    const topRight = tr;
    const bottomRight = br;

    const sevenSegmentLetters = input.filter(detectSeven);
    if (sevenSegmentLetters.length > 0) {
      const [t] = sevenSegmentLetters[0]
        .split('')
        .filter((letter) => ![topRight, bottomRight].includes(letter));
      const top = t;

      const threeSegmentPotentials = input.filter(
        (letters) =>
          letters.includes(top) &&
          letters.includes(bottomRight) &&
          letters.includes(topRight) &&
          letters.length === 5
      );

      const fourSegments = input
        .filter(detectFour)[0]
        .split('')
        .filter((letter) => ![topRight, bottomRight].includes(letter));

      const probablyThree = threeSegmentPotentials[0];
      const middleIndex = probablyThree.includes(fourSegments[0]) ? 0 : 1;

      const center = fourSegments[middleIndex];
      const topLeft = fourSegments[Math.abs(middleIndex - 1)];

      const fiveSegments = input.filter(
        (letters) =>
          letters.includes(top) &&
          letters.includes(bottomRight) &&
          letters.includes(topLeft) &&
          letters.includes(center) &&
          letters.length === 5
      );
      const bottom = fiveSegments[0]
        .split('')
        .filter(
          (letter) => ![top, bottomRight, topLeft, center].includes(letter)
        )[0];

      const bottomLeft = ['a', 'b', 'c', 'd', 'e', 'f', 'g'].filter(
        (letter) =>
          ![bottom, top, center, bottomRight, topRight, topLeft].includes(
            letter
          )
      )[0];

      if (
        center &&
        top &&
        topLeft &&
        topRight &&
        bottom &&
        bottomRight &&
        bottomLeft
      ) {
        const confirmedSegments: Segment = {
          bottom,
          top,
          center,
          bottomLeft,
          bottomRight,
          topRight,
          topLeft,
        };

        const outputNumber: string[] = [];
        const numberIdentifiers = [
          isZero,
          isOne,
          isTwo,
          isThree,
          isFour,
          isFive,
          isSix,
          isSeven,
          isEight,
          isNine,
        ];
        for (const number of output) {
          for (let index = 0; index < numberIdentifiers.length; index++) {
            if (numberIdentifiers[index](confirmedSegments, number)) {
              outputNumber.push(index.toString());
            }
          }
        }

        return parseInt(outputNumber.join(''));
      }
    }
  }

  throw Error('ooopsies');
}
