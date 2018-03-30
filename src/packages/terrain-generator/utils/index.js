/* eslint-disable */

import { proxy } from 'workly';

export const genChunk3 = proxy(({ noise, position, size, depth, frequency, redistribution }) => {
  const chunk = {};

  for (let y = 0; y < depth; y++) {
    for (let x = 0; x < size; x++) {
      for (let z = 0; z < size; z++) {
        if (!chunk[y]) chunk[y] = {};
        if (!chunk[y][x]) chunk[y][x] = {};

        chunk[y][x][z] = 1;
      }
    }
  }

  return chunk;
});
