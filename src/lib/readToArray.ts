import * as fs from 'fs';
import * as readline from 'node:readline';

export async function readToArray<T>(
  filePath: string,
  transform: (line: string) => T
): Promise<T[]> {
  const fileStream = fs.createReadStream(filePath, { encoding: 'utf-8' });
  const lineReader = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });
  const result: T[] = [];
  for await (const line of lineReader) {
    result.push(transform(line));
  }
  return result;
}
