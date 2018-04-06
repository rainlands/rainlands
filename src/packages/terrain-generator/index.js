import euc from 'euclidean-distance'
import { isEqual as lodashIsEqual } from 'lodash'
import * as utils from './utils'


const asyncTimeout = (t) => new Promise((resolve) => setTimeout(resolve, t))

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
      ready: false,
      seed,
      depth,
      chunkSize,
      caves,
      surface,
      chunks: {},
      latestPosition: [],
      latestChunkedPosition: [],
    })

    utils.init(seed).then(() => {
      this.ready = true
    })
  }

  isChunkNeeded = ({ chunkPosition, renderDistance, unrenderOffset }) => {
    const [xStartPos, zStartPos] = this.latestChunkedPosition.map((chunkPos) => chunkPos - (renderDistance + unrenderOffset + 1))

    const [xEndPos, zEndPos] = this.latestChunkedPosition.map((chunkPos) => chunkPos + renderDistance + unrenderOffset - 1)

    const [x, z] = chunkPosition

    return !(+z < zStartPos || +z > zEndPos || (+x < xStartPos || +x > xEndPos))
  }

  async _addChunks({ chunkedPosition, renderDistance, unrenderOffset }) {
    const [xChunkPos, zChunkPos] = chunkedPosition

    const [xStartPos, zStartPos] = chunkedPosition.map((chunkPos) => chunkPos - (renderDistance + 1))

    const [xEndPos, zEndPos] = chunkedPosition.map((chunkPos) => chunkPos + renderDistance)

    for (let x = xStartPos; x < xEndPos; x++) {
      for (let z = zStartPos; z < zEndPos; z++) {
        // if (!this.chunks[x]) this.chunks[x] = {}
        //
        // if (!this.chunks[x][z]) {
        //   this.chunks[x][z] = 0
        //   const chunk = new Uint8Array(await utils.genChunk3({
        //     position: { x, z },
        //     size: this.chunkSize,
        //     depth: this.depth,
        //
        //     frequency: this.caves.frequency,
        //     redistribution: this.caves.redistribution,
        //   }))
        //
        //   if (this.chunks[x] && this.chunks[x][z] === 0) {
        //     this.chunks[x][z] = chunk
        //     if (!added[x]) added[x] = {}
        //     added[x][z] = this.chunks[x][z]
        //   }
        // }
        await asyncTimeout(10)

        if (
          this.isChunkNeeded({
            chunkPosition: [x, z],
            renderDistance,
            unrenderOffset,
          })
        ) {
          if (!this.chunks[x]) this.chunks[x] = {}
          if (!this.chunks[x][z]) {
            this.chunks[x][z] = 'Loading...'

            await utils
              .genChunk3({
                position: { x, z },
                size: this.chunkSize,
                depth: this.depth,

                ...this.caves,
              })
              .then(async (chunk) => {
                if (this.chunks[x] && this.chunks[x][z] === 'Loading...') {
                  // this.chunks[x][z] = new Uint8Array(chunk)
                  this.chunks[x][z] = chunk

                  this.callOnUpdate({
                    removed: {},
                    added: {
                      [x]: {
                        [z]: this.chunks[x][z],
                      },
                    },
                  })
                }
              })
          }
        }
      }
    }
  }

  _removeChunks({ chunkedPosition, renderDistance, unrenderOffset }) {
    const [xStartPos, zStartPos] = chunkedPosition.map((chunkPos) => chunkPos - (renderDistance + unrenderOffset + 1))

    const [xEndPos, zEndPos] = chunkedPosition.map((chunkPos) => chunkPos + renderDistance + unrenderOffset - 1)

    Object.keys(this.chunks).forEach(async (x) => {
      Object.keys(this.chunks[x]).forEach(async (z) => {
        await asyncTimeout(100)

        if (this.chunks[x] && this.chunks[x][z]) {
          if (+z < zStartPos || +z > zEndPos || (+x < xStartPos || +x > xEndPos)) {
            this.callOnUpdate({
              added: {},
              removed: {
                [x]: {
                  [z]: this.chunks[x][z],
                },
              },
            })

            delete this.chunks[x][z]
            if (Object.keys(this.chunks[x]).length === 0) {
              delete this.chunks[x]
            }
          }
        }
      })
      await asyncTimeout(1000)
    })
  }

  async _updateChunks(params) {
    this._addChunks(params)
    this._removeChunks(params)
  }

  callOnUpdate(data) {
    if (this.onUpdateCallback) {
      this.onUpdateCallback(data)
    }
  }

  onUpdate(func) {
    this.onUpdateCallback = func
  }

  update({ position, renderDistance, unrenderOffset }) {
    const { x, z } = position

    if (this.ready && !lodashIsEqual([x, z], this.latestPosition)) {
      this.latestPosition = [x, z]

      const chunkedPosition = [x, z].map((v) => {
        let c = Math.ceil((v + this.chunkSize / 2) / this.chunkSize)

        if (Object.is(c, -0)) c = 0

        return c
      })

      if (!lodashIsEqual(chunkedPosition, this.latestChunkedPosition)) {
        this.latestChunkedPosition = chunkedPosition

        this._updateChunks({
          chunkedPosition,
          renderDistance,
          unrenderOffset,
        })
      }
    }
  }
}
