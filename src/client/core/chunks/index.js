import * as THREE from 'three'
import { chunk as lodashChunk } from 'lodash'
import isBlockHidden from '@client/utils/isBlockHidden'


const CHUNKS_MAP = {}
const CUBE_MESH = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1))

export const renderChunk = ({
  chunk: { position, data, height },
  chunkDepth,
  chunkSize,
  scene,
}) => {
  const geometry = new THREE.Geometry()
  const chunked = lodashChunk(lodashChunk(data, chunkDepth), chunkSize)

  const [i, j] = position

  for (let x = 0; x < chunked.length; x++) {
    for (let z = 0; z < chunked[x].length; z++) {
      for (let y = 0; y <= height; y++) {
        if (
          !isBlockHidden({
            map: chunked,
            position: [x, y, z],
            chunkSize,
          })
        ) {
          const block = chunked[x][z][y]

          if (block > 0) {
            CUBE_MESH.position.set(x + chunkSize * i - 8, y, z + chunkSize * j - 8)
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
  }, 100)
}

export const removeChunk = ({ chunk: { position }, scene }) => {
  const [i, j] = position

  setTimeout(() => {
    if (CHUNKS_MAP[i]) {
      const chunkID = CHUNKS_MAP[i][j]

      delete CHUNKS_MAP[i][j]

      const chunk = scene.getObjectByName(chunkID)

      if (chunk) {
        scene.remove(chunk)
      }
    }
  }, 100)
}

export const updateChunks = () => {}
