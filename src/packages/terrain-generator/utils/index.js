import { mapObject } from '@packages/utils';

export const genChunk3 = ({
  noise, position, size, depth, frequency, redistribution,
}) => {
  const { x: xStart, z: zStart } = mapObject(position, (key, value, index) => value * size);

  const { x: xEnd, z: zEnd } = mapObject(position, (key, value, index) => value * size + size);

  const chunk = {};

  for (let y = 0; y < depth; y++) {
    chunk[y] = {};

    for (let x = xStart; x < xEnd; x++) {
      chunk[y][x] = {};

      for (let z = zStart; z < zEnd; z++) {
        const noiseValue = noise.perlin3(x / frequency, y / frequency, z / frequency);

        const normalized = (noiseValue + 1) / 2; // 0 - 1
        const redistributed = Math.pow(normalized, redistribution);

        chunk[y][x][z] = redistributed;
      }
    }
  }

  return chunk;
};
