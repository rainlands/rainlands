import TerrainGenerator from '@packages/terrain-generator';

import { createCamera } from './core/camera';
import { createRenderer } from './core/renderer';
import { createScene } from './core/scene';

export default class Client {
  constructor({ container }) {
    this.renderer = createRenderer({ container });

    this.camera = createCamera({
      container,
      fow: 45,
      near: 0.3,
      far: 300,
      position: [0, 0, 0],
    });

    this.scene = createScene({
      fog: {
        near: 0,
        far: 100,
      },
      helpers: {
        axes: 5,
      },
    });

    this.generator = new TerrainGenerator();
  }
}
