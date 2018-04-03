import * as THREE from 'three'
import TerrainGenerator from '@packages/terrain-generator'

import { createCamera } from '@client/core/camera'
import { createRenderer } from '@client/core/renderer'
import { createScene } from '@client/core/scene'

import * as controls from '@client/utils/controls'
import Stats from '@client/utils/Stats'


export default class Client {
  constructor({ container }) {
    this.stats = new Stats()

    this.renderer = createRenderer({ container, clearColor: '#212121' })

    this.camera = createCamera({
      container,
      fow: 45,
      near: 0.3,
      far: 300,
      position: [1, 1, 5],
    })
    controls.initializeControls(this.camera)

    this.scene = createScene({
      fog: {
        near: 0,
        far: 100,
      },
      helpers: {
        axes: 5,
      },
    })

    this.generator = new TerrainGenerator({
      seed: 1,
      depth: 20,
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
    })

    this.generator.onUpdate(({ added, removed }) => {
      this.updateMap({ added, removed })
    })
  }

  animate = () => {
    this.stats.begin()

    requestAnimationFrame(this.animate)

    controls.animateMovementTick({ camera: this.camera, speed: 0.15 })

    this.renderer.render(this.scene, this.camera)

    this.generator.update({
      position: this.camera.position,
      renderDistance: 3,
      unrenderOffset: 0,
    })

    this.stats.end()
  }

  updateMap({ added, removed }) {
    console.log(added)
    // TODO: Render new chunks and clear removed
  }
}
