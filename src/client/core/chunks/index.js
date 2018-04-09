import * as THREE from 'three'
import uuid from 'uuid/v4'
import WebworkerPromise from 'webworker-promise'
import { loadMaterials } from './materials'

import ChunksWorker from './chunks.worker'


const chunksWorker = new WebworkerPromise(new ChunksWorker())
const jsonLoader = new THREE.JSONLoader()

const CHUNKS_MAP = {}
const CUBE_MESH = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1))

const asyncTimeout = (t) => new Promise((resolve) => setTimeout(resolve, t))

export const renderChunk = async ({ scene, ...payload }, settings) => {
  const layers = await chunksWorker.postMessage(payload)
  const [i, j] = payload.chunk.position

  Object.keys(layers).forEach((block, index) => {
    const { geometry } = jsonLoader.parse(layers[block])

    const mesh = new THREE.Mesh(
      new THREE.BufferGeometry().fromGeometry(geometry),
      loadMaterials(block)
    )
    const id = uuid()

    mesh.name = id

    if (!CHUNKS_MAP[i]) CHUNKS_MAP[i] = {}
    if (!CHUNKS_MAP[i][j]) CHUNKS_MAP[i][j] = []
    CHUNKS_MAP[i][j].push(id)

    if (settings.smoothChunksAppear) {
      mesh.material.transparent = true
      mesh.material.opacity = 0
    }

    setTimeout(() => {
      if (CHUNKS_MAP[i] && CHUNKS_MAP[i][j]) {
        scene.add(mesh)
      }

      if (settings.smoothChunksAppear) {
        for (let i = 0; i < 20; i++) {
          setTimeout(() => {
            const chunk = scene.getObjectByName(id)

            chunk.material.opacity += 0.05
          }, 25 * i)
        }
      }
    }, 200 * index)
  })
}

export const removeChunk = ({ chunk: { position }, scene }) => {
  const [i, j] = position

  setTimeout(() => {
    if (CHUNKS_MAP[i] && CHUNKS_MAP[i][j]) {
      const chunksID = CHUNKS_MAP[i][j]

      chunksID.forEach((id) => {
        const chunk = scene.getObjectByName(id)

        if (chunk) {
          scene.remove(chunk)
        }
      })

      delete CHUNKS_MAP[i][j]
    }
  }, 100)
}

export const updateChunks = () => {}
