import path from 'path';

export default function input(directory: string, file: string) {
  return path.join(directory, file);
}
