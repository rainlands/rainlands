const registerWebworker = require('webworker-promise/lib/register')
const THREE = require('three')
const lodashChunk = require('lodash/chunk')
const isBlockHidden = require('./isBlockHidden.js')


const CUBE_MESH = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1))

const renderChunk = ({ chunk: { position, data, height }, chunkDepth, chunkSize }) => {
  const chunked = lodashChunk(lodashChunk(data, chunkDepth), chunkSize)
  const layers = {}

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

          if (block !== 0) {
            if (!layers[block]) {
              layers[block] = new THREE.Geometry()
            }

            const translationX = x + chunkSize * i - 8
            const translationY = y
            const translationZ = z + chunkSize * j - 8

            CUBE_MESH.translateX(translationX)
            CUBE_MESH.translateY(translationY)
            CUBE_MESH.translateZ(translationZ)

            CUBE_MESH.updateMatrix()
            layers[block].merge(CUBE_MESH.geometry, CUBE_MESH.matrix)

            CUBE_MESH.translateX(-translationX)
            CUBE_MESH.translateY(-translationY)
            CUBE_MESH.translateZ(-translationZ)
          }
        }
      }
    }
  }

  Object.keys(layers).forEach((key) => {
    // layers[key].shading = THREE.SmoothShading
    layers[key] = layers[key].toJSON()
  })

  return layers
}

registerWebworker(async (payload) => renderChunk(payload))
