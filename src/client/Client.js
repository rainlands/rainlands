import * as THREE from 'three'
import TerrainGenerator from '@packages/terrain-generator'

import { createCamera } from '@client/core/camera'
import { createRenderer } from '@client/core/renderer'
import { createScene } from '@client/core/scene'
import { renderChunks, removeChunks } from '@client/core/chunks'

import * as controls from '@client/utils/controls'
import Stats from '@client/utils/Stats'

// params
import { settingsStore } from '@client/stores'


export default class Client {
  constructor({ container }) {
    this.stats = new Stats()

    this.renderer = createRenderer({ container, clearColor: '#212121' })

    this.camera = createCamera({
      container,
      fow: 45,
      near: 0.3,
      far: 300,
      position: [0, 100, 0],
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

    this.generator = new TerrainGenerator(settingsStore.game.map)

    this.generator.onUpdate(({ added, removed }) => {
      this.updateMap({ added, removed })
    })
  }

  animate = () => {
    this.stats.begin()

    requestAnimationFrame(this.animate)

    controls.animateMovementTick({ camera: this.camera, speed: settingsStore.game.player.speed })

    this.renderer.render(this.scene, this.camera)

    this.generator.update({
      position: this.camera.position,
      ...settingsStore.game.render,
    })

    this.stats.end()
  }

  updateMap({ added, removed }) {
    renderChunks({
      chunks: added,
      scene: this.scene,
      chunkSize: 16,
    })
    removeChunks({
      chunks: removed,
      scene: this.scene,
    })
  }
}
