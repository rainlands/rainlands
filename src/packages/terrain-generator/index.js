import euc from 'euclidean-distance'
import { isEqual } from 'lodash'
import * as THREE from 'three'
import * as utils from './utils'


export default class TerrainGenerator {
  constructor({
    seed = Math.random() * 100,
    chunkDepth = 10,
    chunkSize = 16,
    updateInterval = 100,
    caves = {
      frequency: 5,
      redistribution: 100,
      octaves: 1,
      octavesCoef: 0.5,
    },
    surface = {
      frequency: 100,
      redistribution: 3,
      octaves: 1,
      octavesCoef: 0.5,
      minHeight: 25,
      maxHeight: 75,
    },
  } = {}) {
    Object.assign(this, {
      ready: false,
      seed,
      chunkDepth,
      chunkSize,
      updateInterval,
      caves,
      surface,
      sent: [],
      unsent: [],
      latestParams: {
        position: [],
        chunkedPosition: [],
      },
    })

    utils.init(seed).then(() => {
      this.ready = true
      this.frustum = new THREE.Frustum()

      this._startQueue(updateInterval)
    })
  }

  _startQueue(interval) {
    setInterval(() => {
      const { chunkedPosition, projectionMatrix, renderDistance } = this.latestParams

      this.frustum.setFromMatrix(projectionMatrix)

      // this.unsent = this.unsent
      //   .sort((a, b) => euc(b.position, chunkedPosition) > euc(a.position, chunkedPosition))
      //   .reverse()

      this.unsent = this.unsent
        .sort((a, b) => {
          const visibleA = this.frustum.containsPoint(new THREE.Vector3(
            a.position[0] * this.chunkSize,
            a.height,
            a.position[1] * this.chunkSize
          ))

          const visibleB = this.frustum.containsPoint(new THREE.Vector3(
            b.position[0] * this.chunkSize,
            b.height,
            b.position[1] * this.chunkSize
          ))

          if ((visibleA && visibleB) || (!visibleA && !visibleB)) {
            return euc(b.position, chunkedPosition) > euc(a.position, chunkedPosition)
          }
          return true
        })
        .reverse()

      for (let i = 0; i < this.unsent.length; i++) {
        const chunk = this.unsent[i]

        if (
          !this.frustum.containsPoint(new THREE.Vector3(
            chunk.position[0] * this.chunkSize,
            chunk.height + 10,
            chunk.position[1] * this.chunkSize
          ))
          && euc(chunk.position, chunkedPosition) > renderDistance / 3
        ) {
          continue
        }

        if (this._isChunkNeeded(chunk.position)) {
          this._callOnUpdate({
            added: chunk,
          })

          this.sent.push(this.unsent.splice(i, 1)[0])

          break
        }
        else {
          this.unsent.splice(i, 1)
        }
      }

      this.sent = this.sent
        .sort((a, b) => euc(b.position, chunkedPosition) < euc(a.position, chunkedPosition))
        .reverse()

      for (let i = 0; i < this.sent.length; i++) {
        const chunk = this.sent[i]

        if (!this._isChunkNeeded(chunk.position, true)) {
          this._callOnUpdate({
            removed: chunk,
          })
          this.sent.splice(i, 1)

          break
        }
      }
    }, interval)
  }

  _isChunkNeeded(chunkPosition) {
    const {
      chunkedPosition: userChunkedPosition,
      renderDistance,
      unrenderOffset,
    } = this.latestParams

    const [minX, minZ] = userChunkedPosition.map((e) => e - (renderDistance + unrenderOffset))
    const [maxX, maxZ] = userChunkedPosition.map((e) => e + (renderDistance + unrenderOffset))

    const [chunkX, chunkZ] = chunkPosition

    return chunkX >= minX && chunkX <= maxX && chunkZ >= minZ && chunkZ <= maxZ
  }

  async _loadChunks({ chunkedPosition, renderDistance, unrenderOffset }) {
    let positionsToGen = []

    for (let i = -renderDistance; i < renderDistance + 1; i++) {
      for (let j = -renderDistance; j < renderDistance + 1; j++) {
        const position = [chunkedPosition[0] + i, chunkedPosition[1] + j]

        if (
          !this.sent.find((e) => isEqual(e.position, position))
          && !this.unsent.find((e) => isEqual(e.position, position))
        ) {
          positionsToGen.push(position)
        }
      }
    }

    positionsToGen = positionsToGen
      .sort((a, b) => euc(b, chunkedPosition) > euc(a, chunkedPosition))
      .reverse()

    for (let i = 0; i < positionsToGen.length; i++) {
      const position = positionsToGen[i]

      const { chunkSize, chunkDepth, surface, caves } = this
      const chunk = new Uint8Array(chunkSize * chunkSize * chunkDepth)

      let transferred = 0
      let maxHeight = 0

      await utils.genChunk3(
        { position, chunkSize, chunkDepth, surface, caves },
        (event, { height, data }) => {
          if (event === 'column') {
            const column = new Uint8Array(data)

            if (maxHeight < height) maxHeight = height

            chunk.set(column, transferred)
            transferred += column.length
          }
        }
      )

      if (this._isChunkNeeded(position)) {
        this.unsent.push({
          position,
          data: chunk,
          height: maxHeight,
        })
      }
    }
  }

  _callOnUpdate(data) {
    if (this.onUpdateCallback) {
      this.onUpdateCallback(data)
    }
  }

  update({ position, projectionMatrix, renderDistance, unrenderOffset }) {
    const { x, y, z } = position

    Object.assign(this.latestParams, {
      projectionMatrix,
      renderDistance,
      unrenderOffset,
      height: y,
    })

    if (this.ready && !isEqual([x, z], this.latestParams.position)) {
      this.latestParams.position = [x, z]

      const chunkedPosition = [x, z].map((v) => {
        let c = Math.ceil((v - this.chunkSize / 2) / this.chunkSize)

        if (Object.is(c, -0)) c = 0

        return c
      })

      if (!isEqual(chunkedPosition, this.latestParams.chunkedPosition)) {
        this.latestParams.chunkedPosition = chunkedPosition

        this._loadChunks({
          chunkedPosition,
          renderDistance,
          unrenderOffset,
        })
      }
    }
  }

  onUpdate(func) {
    this.onUpdateCallback = func
  }
}
