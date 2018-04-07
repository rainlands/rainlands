import * as THREE from 'three'
import TerrainGenerator from '@packages/terrain-generator'
import { toJS } from 'mobx'

import { createCamera } from '@client/core/camera'
import { createRenderer } from '@client/core/renderer'
import { createScene } from '@client/core/scene'
import { renderChunk, removeChunk } from '@client/core/chunks'

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
      ...settingsStore.game.player,
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

    this.generator = new TerrainGenerator(toJS(settingsStore.game.map))

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
    if (added) {
      renderChunk({
        chunk: added,
        scene: this.scene,
        ...settingsStore.game.map,
      })
    }

    if (removed) {
      removeChunk({
        chunk: removed,
        scene: this.scene,
      })
    }
  }
}
