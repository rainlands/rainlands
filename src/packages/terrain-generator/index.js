/* eslint-disable */

import { Noise } from 'noisejs';
import * as utils from './utils';

export default class TerrainGenerator {
  constructor({
    seed = Math.random() * 100,
    depth = 100,
    chunkSize = 16,
    caves = {
      frequency: 5,
      redistribution: 100,
    },
    surface = {
      frequency: 100,
      redistribution: 3,
      minHeight: 25,
      maxHeight: 75,
    },
  } = {}) {
    Object.assign(this, {
      noise: new Noise(seed),
      depth,
      chunkSize,
      caves,
      surface,
      chunks: {},
    });
  }

  onUpdate(func) {
    this.onUpdate = func;
  }

  update({ position, renderDistance, unrenderOffset }) {
    const chunkedPosition = position.map(v => {
      let c = Math.ceil((v + this.chunkSize / 2) / this.chunkSize);

      if (Object.is(c, -0)) c = 0;

      return c;
    });

    const [x, z] = chunkedPosition;

    if (!(this.chunks[x] && this.chunks[x][z])) {
      process.nextTick(() => {
        this._updateChunks({ chunkedPosition });
      });
    }
  }

  async _updateChunks({ chunkedPosition }) {
    console.log('123');
    await utils.genChunk3({
      noise: this.noise,

      position: chunkedPosition,
      size: this.chunkSize,
      depth: this.depth,

      frequency: this.caves.frequency,
      redistribution: this.caves.redistribution,
    });
  }
}
