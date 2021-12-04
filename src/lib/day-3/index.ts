import { readToArray } from '../readToArray';

function toDecimal(binary: string) {
  return parseInt(binary, 2);
}

async function getData(filePath: string) {
  return await readToArray(filePath, (line) => line);
}

function valueLength(array: string[]) {
  return array[0].length;
}

function commonBits(
  counts: number[],
  data: string[],
  mostCommon: string,
  leastCommon: string
) {
  return counts.map((count) => {
    const halfLength = data.length / 2;
    if (count >= halfLength) {
      return mostCommon;
    }

    return leastCommon;
  });
}

function calculateEpsilon(data: string[]) {
  const counts: number[] = countOnes(data);
  const epsilonArray = commonBits(counts, data, '0', '1');
  const epsilon = epsilonArray.join('');

  return epsilon;
}

function countOnes(data: string[]) {
  const length = valueLength(data);

  const counts: number[] = new Array(length).fill(0);
  for (const reading of data) {
    for (let index = 0; index < reading.length; index++) {
      counts[index] = counts[index] + parseInt(reading[index]);
    }
  }
  return counts;
}

function calculateGamma(data: string[]) {
  const counts: number[] = countOnes(data);
  const gammaArray = commonBits(counts, data, '1', '0');
  const gamma = gammaArray.join('');

  return gamma;
}

export async function powerConsumption(filePath: string | string[]) {
  let data: string[];

  if (typeof filePath === 'string') {
    data = await getData(filePath);
  } else {
    data = filePath;
  }

  const epsilon = calculateEpsilon(data);
  const gamma = calculateGamma(data);

  return toDecimal(gamma) * toDecimal(epsilon);
}

function findLifeSupportValue(
  data: string[],
  extractor: (data: string[]) => string
) {
  const length = valueLength(data);
  let candidates = data;
  for (let index = 0; index < length; index++) {
    if (candidates.length > 1) {
      const value = extractor(candidates);
      candidates = candidates.filter(
        (candidate) => candidate[index] === value[index]
      );
    } else {
      break;
    }
  }

  return candidates[0];
}

export async function lifeSupport(filePath: string) {
  const data = await getData(filePath);
  const oxygen = findLifeSupportValue(data, calculateGamma);
  const co2 = findLifeSupportValue(data, calculateEpsilon);

  return toDecimal(oxygen) * toDecimal(co2);
}
