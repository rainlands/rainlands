/* eslint-disable */

import * as utils from './utils';

export default class TerrainGenerator {
  constructor({
    seed = Math.random() * 100,
    height = 100,
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
    (async () => {
      console.log(await utils.genNoise2());
    })();
  }

  onUpdate(func) {
    // func({
    //   chunks: {},
    //   added: {},
    //   removed: {},
    // });
  }

  update({ position }) {}
}
