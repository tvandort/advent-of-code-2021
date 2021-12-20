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
  { top, center, topRight, topLeft, bottomRight, bottom }: Segment,
  number: string
) {
  return includesExactly(number, [
    top,
    center,
    topRight,
    topLeft,
    bottomRight,
    bottom,
  ]);
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
  const oneSegmentLetters = input.filter(detectOne)[0];
  if (oneSegmentLetters) {
    const [tr, br] = oneSegmentLetters.split('');
    let topRight = tr;
    let bottomRight = br;
    const sevenSegmentLetters = input.filter(detectSeven)[0];
    if (sevenSegmentLetters) {
      const [t] = sevenSegmentLetters
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
      if (probablyThree) {
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
        )[0];
        const fiveSegmentsSwapped = input.filter(
          (letters) =>
            letters.includes(top) &&
            letters.includes(topRight) &&
            letters.includes(topLeft) &&
            letters.includes(center) &&
            letters.length === 5
        )[0];
        if (fiveSegments) {
          return secondToLast(
            fiveSegments,
            output,
            center,
            top,
            topRight,
            bottomRight,
            topLeft
          );
        } else if (fiveSegmentsSwapped) {
          const swap = topRight;
          topRight = bottomRight;
          bottomRight = swap;

          return secondToLast(
            fiveSegmentsSwapped,
            output,
            center,
            top,
            topRight,
            bottomRight,
            topLeft
          );
        } else {
          throw Error('didnt find possible 5');
        }
      } else {
        throw Error('didnt find a possible 3');
      }
    } else {
      throw Error('did not find 7');
    }
  } else {
    throw Error('did not find 1');
  }

  throw Error('ooopsies');
}

function secondToLast(
  fiveSegments: string,
  output: string[],
  center: string,
  top: string,
  topRight: string,
  bottomRight: string,
  topLeft: string
) {
  const bottom = fiveSegments
    .split('')
    .filter(
      (letter) => ![top, bottomRight, topLeft, center].includes(letter)
    )[0];

  const bottomLeft = ['a', 'b', 'c', 'd', 'e', 'f', 'g'].filter(
    (letter) =>
      ![bottom, top, center, bottomRight, topRight, topLeft].includes(letter)
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
    return last(
      bottom,
      top,
      center,
      bottomLeft,
      bottomRight,
      topRight,
      topLeft,
      output
    );
  } else {
    throw new Error('missing some segment 1');
  }
}

function last(
  bottom: string,
  top: string,
  center: string,
  bottomLeft: string,
  bottomRight: string,
  topRight: string,
  topLeft: string,
  output: string[]
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

export async function addFromFile(filePath: string) {
  const outputs = await readToArray(filePath, (line) => {
    const [input, output] = line.split('|');
    return { output: output.trim().split(' '), input: input.trim().split(' ') };
  });

  const numbers = outputs.map(determineNumbers);

  return numbers.reduce((previous, current) => current + previous);
}
