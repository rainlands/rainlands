import * as THREE from 'three'
import { chunk as lodashChunk } from 'lodash'
import isBlockHidden from '@client/utils/isBlockHidden'


const CHUNKS_MAP = {}
const CUBE_MESH = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1))

export const renderChunks = ({ chunks, scene, chunkSize }) => {
  Object.keys(chunks).forEach((i, indexI) => {
    Object.keys(chunks[i]).forEach((j, indexJ) => {
      const geometry = new THREE.Geometry()
      const chunked = lodashChunk(lodashChunk(new Uint8Array(chunks[i][j]), 16), 16)

      for (let y = 0; y < chunked.length; y++) {
        for (let x = 0; x < chunked[y].length; x++) {
          for (let z = 0; z < chunked[y][x].length; z++) {
            if (
              !isBlockHidden({
                map: chunked,
                position: [y, x, z],
              })
            ) {
              const block = chunked[y][x][z]

              if (block > 0) {
                CUBE_MESH.position.set(+x + chunkSize * +i - 8, +y, +z + chunkSize * +j - 8)
                CUBE_MESH.updateMatrix()
                geometry.merge(CUBE_MESH.geometry, CUBE_MESH.matrix)
              }
            }
          }
        }
      }

      const id = Date.now()
      const mesh = new THREE.Mesh(
        new THREE.BufferGeometry().fromGeometry(geometry),
        new THREE.MeshNormalMaterial()
      )

      if (!CHUNKS_MAP[i]) CHUNKS_MAP[i] = {}
      CHUNKS_MAP[i][j] = id

      setTimeout(() => {
        if (CHUNKS_MAP[i] && CHUNKS_MAP[i][j]) {
          mesh.name = id

          scene.add(mesh)
        }
      }, (indexI + indexJ + 1) * 500)
    })
  })
}

export const removeChunks = ({ chunks, scene }) => {
  Object.keys(chunks).forEach((i, indexI) => {
    Object.keys(chunks[i]).forEach((j, indexJ) => {
      if (CHUNKS_MAP[i]) {
        const chunkID = CHUNKS_MAP[i][j]

        delete CHUNKS_MAP[i][j]

        setTimeout(() => {
          const chunk = scene.getObjectByName(chunkID)

          if (chunk) {
            scene.remove(chunk)
          }
        }, (indexI + indexJ + 1) * 500)
      }
    })
  })
}

export const updateChunks = () => {}
