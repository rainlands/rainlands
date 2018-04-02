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

    this.generator = new TerrainGenerator({
      seed: 1,
      depth: 1,
      chunkSize: 16,
      caves: {
        frequency: 5,
        redistribution: 100,
      },
      surface: {
        frequency: 100,
        redistribution: 3,
        minHeight: 25,
        maxHeight: 75,
      },
    });

    this.generator.onUpdate(({ added, removed }) => {
      this.updateMap({ added, removed });
    });
  }

  animate = () => {
    requestAnimationFrame(this.animate);

    const { x, z } = this.camera.position;

    this.generator.update({
      position: [x, z],
      renderDistance: 1,
      unrenderOffset: 0,
    });

    this.camera.position.x += 0.2;
    this.camera.position.z += 0.2;
  };

  updateMap({ added, removed }) {
    // TODO: Render new chunks and clear removed
  }
}
