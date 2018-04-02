import { Noise } from 'noisejs';
import * as utils from './utils';

export default class TerrainGenerator {
  constructor({
    seed = Math.random() * 100,
    depth = 10,
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

  _addChunks({ chunkedPosition, renderDistance, unrenderOffset }) {
    const [xChunkPos, zChunkPos] = chunkedPosition;

    const [xStartPos, zStartPos] = chunkedPosition.map(chunkPos => chunkPos - (renderDistance + 1));

    const [xEndPos, zEndPos] = chunkedPosition.map(chunkPos => chunkPos + renderDistance);

    const added = {};

    for (let x = xStartPos; x < xEndPos; x++) {
      for (let z = zStartPos; z < zEndPos; z++) {
        if (!this.chunks[x]) this.chunks[x] = {};

        if (!this.chunks[x][z]) {
          this.chunks[x][z] = utils.genChunk3({
            noise: this.noise,

            position: { x, z },
            size: this.chunkSize,
            depth: this.depth,

            frequency: this.caves.frequency,
            redistribution: this.caves.redistribution,
          });

          if (!added[x]) added[x] = {};
          added[x][z] = this.chunks[x][z];
        }
      }
    }

    return added;
  }

  _removeChunks({ chunkedPosition, renderDistance, unrenderOffset }) {
    const removed = {};
    const [xChunkPos, zChunkPos] = chunkedPosition;

    const [xStartPos, zStartPos] = chunkedPosition.map(chunkPos => chunkPos - (renderDistance + 1 + unrenderOffset));

    const [xEndPos, zEndPos] = chunkedPosition.map(chunkPos => chunkPos + renderDistance + unrenderOffset);

    Object.keys(this.chunks).forEach((x) => {
      Object.keys(this.chunks[x]).forEach((z) => {
        if (+z < zStartPos || +z > zEndPos || (+x < xStartPos || +x > xEndPos)) {
          if (!removed[x]) removed[x] = {};
          removed[x][z] = { ...this.chunks[x][z] };

          delete this.chunks[x][z];
          if (Object.keys(this.chunks[x]).length === 0) {
            delete this.chunks[x];
          }
        }
      });
    });

    return removed;
  }

  _updateChunks(params) {
    const added = this._addChunks(params);
    const removed = this._removeChunks(params);

    if (Object.keys(added).length > 0 || Object.keys(removed).length > 0) {
      this.callOnUpdate({ added, removed });
    }
  }

  callOnUpdate(data) {
    if (this.onUpdateCallback) {
      this.onUpdateCallback(data);
    }
  }

  onUpdate(func) {
    this.onUpdateCallback = func;
  }

  update({ position, renderDistance, unrenderOffset }) {
    const { x, z } = position;

    const chunkedPosition = [x, z].map((v) => {
      let c = Math.ceil((v + this.chunkSize / 2) / this.chunkSize);

      if (Object.is(c, -0)) c = 0;

      return c;
    });

    this._updateChunks({
      chunkedPosition,
      renderDistance,
      unrenderOffset,
    });
  }
}
