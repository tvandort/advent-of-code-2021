import * as fs from 'fs';

export default async function countIncreases(file: string) {
  let increases = 0;

  const readable = fs.createReadStream(file, { encoding: 'utf-8' });
  let last = null;
  for await (const chunk of readable) {
    if (last != null) {
      console.log(chunk);
    }

    last = chunk;
  }

  return increases;
}
