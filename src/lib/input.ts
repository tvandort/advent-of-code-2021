import path from 'path';

export function createInputGetter(directory: string): (file: string) => string {
  return (file: string) => {
    return path.join(directory, file);
  };
}

export default function input(directory: string, file: string) {
  return path.join(directory, file);
}
