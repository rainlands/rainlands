import euc from 'euclidean-distance'
import { isEqual } from 'lodash'
import * as utils from './utils'


export default class TerrainGenerator {
  constructor({
    seed = Math.random() * 100,
    chunkDepth = 10,
    chunkSize = 16,
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

      this._startQueue()
    })
  }

  _startQueue() {
    setInterval(() => {
      // if (this.pending.length > 0) {
      //   const { chunkedPosition } = this.latestParams
      //
      //   this.pending = this.pending
      //     .sort((a, b) => euc(b.position, chunkedPosition) > euc(a.position, chunkedPosition))
      //     .reverse()
      //
      //   for (let i = 0; i < this.pending.length; i++) {
      //     const chunk = this.pending[i]
      //
      //     if (chunk) {
      //       if (this._isChunkNeeded(chunk.position)) {
      //         if (!chunk.sent) {
      //           this._callOnUpdate({
      //             added: chunk,
      //           })
      //
      //           this.pending[i].sent = true
      //
      //           break
      //         }
      //       }
      //       else {
      //         this._callOnUpdate({
      //           removed: this.pending.splice(i, 1)[0],
      //         })
      //       }
      //     }
      //   }
      // }

      const { chunkedPosition } = this.latestParams

      this.unsent = this.unsent
        .sort((a, b) => euc(b.position, chunkedPosition) > euc(a.position, chunkedPosition))
        .reverse()

      for (let i = 0; i < this.unsent.length; i++) {
        const chunk = this.unsent[i]

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

        if (!this._isChunkNeeded(chunk.position)) {
          this._callOnUpdate({
            removed: chunk,
          })
          this.sent.splice(i, 1)

          break
        }
      }
    }, 100)
  }

  _isChunkNeeded(chunkPosition) {
    const {
      chunkedPosition: userChunkedPosition,
      renderDistance,
      preloadOffset,
    } = this.latestParams

    const [minX, minZ] = userChunkedPosition.map((e) => e - (renderDistance + preloadOffset))
    const [maxX, maxZ] = userChunkedPosition.map((e) => e + (renderDistance + preloadOffset))

    const [chunkX, chunkZ] = chunkPosition

    return chunkX >= minX && chunkX <= maxX && chunkZ >= minZ && chunkZ <= maxZ
  }

  async _loadChunks({ chunkedPosition, renderDistance, unrenderOffset, preloadOffset }) {
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

      await utils.genChunk3({ position, chunkSize, chunkDepth, surface, caves }, (event, data) => {
        if (event === 'column') {
          const column = new Uint8Array(data)

          chunk.set(column, transferred)
          transferred += column.length
        }
      })

      if (this._isChunkNeeded(position)) {
        this.unsent.push({
          position,
          data: chunk,
        })
      }
    }

    // for (let i = -renderDistance; i < renderDistance + 1; i++) {
    //   for (let j = -renderDistance; j < renderDistance + 1; j++) {
    //     const position = [chunkedPosition[0] + i, chunkedPosition[1] + j]
    //
    //     if (!this.pending.find((e) => isEqual(e.position, position))) {
    //       const { chunkSize, chunkDepth, surface, caves } = this
    //       const chunk = new Uint8Array(chunkSize * chunkSize * chunkDepth)
    //
    //       let transferred = 0
    //
    //       await utils.genChunk3(
    //         { position, chunkSize, chunkDepth, surface, caves },
    //         (event, data) => {
    //           if (event === 'column') {
    //             const column = new Uint8Array(data)
    //
    //             chunk.set(column, transferred)
    //             transferred += column.length
    //           }
    //         }
    //       )
    //
    //       if (this._isChunkNeeded(position)) {
    //         this.pending.push({
    //           position,
    //           data: chunk,
    //         })
    //       }
    //     }
    //   }
    // }

    // for (let i = -preloadOffset; i < preloadOffset + 1; i++) {
    //   for (let j = -preloadOffset; j < preloadOffset + 1; j++) {
    //     const position = [chunkedPosition[0] + i, chunkedPosition[1] + j]
    //
    //     if (!this.pending.find((e) => isEqual(e.position, position))) {
    //       this.pending.push({
    //         position,
    //         data: 2,
    //       })
    //     }
    //   }
    // }
  }

  _callOnUpdate(data) {
    if (this.onUpdateCallback) {
      this.onUpdateCallback(data)
    }
  }

  update({ position, renderDistance, unrenderOffset, preloadOffset }) {
    const { x, z } = position

    Object.assign(this.latestParams, {
      renderDistance,
      unrenderOffset,
      preloadOffset,
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
          preloadOffset,
        })
      }
    }
  }

  onUpdate(func) {
    this.onUpdateCallback = func
  }
}
