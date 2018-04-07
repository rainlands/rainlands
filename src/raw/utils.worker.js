// worker.js
const registerWebworker = require('webworker-promise/lib/register')
const Noisejs = require('noisejs')


let noise

const genSurfacePoint = (
  position,
  { frequency, redistribution, octaves, octavesCoef, minHeight, maxHeight }
) => 5

const genCavesPoint = ({ position, frequency, redistribution, octaves, octavesCoef }) => {}

const genChunk3 = ({ position, chunkSize, chunkDepth, caves, surface }, emit) => {
  const [xStart, zStart] = Object.values(position).map((v) => v * chunkSize)
  const [xEnd, zEnd] = Object.values(position).map((v) => v * chunkSize + chunkSize)

  for (let x = xStart; x < xEnd; x++) {
    for (let z = zStart; z < zEnd; z++) {
      const column = new Uint8Array(chunkDepth)
      const height = genSurfacePoint([x, z], surface)

      for (let y = 0; y < chunkDepth; y++) {
        if (y <= height) {
          column[y] = 1
        }
        else {
          column[y] = 0
        }
      }

      emit('column', column.buffer)
    }
  }

  // for (let y = 0; y < depth; y++) {
  //   const layer = []
  //
  //   for (let x = xStart; x < xEnd; x++) {
  //     for (let z = zStart; z < zEnd; z++) {
  //       let noiseValue = 0
  //
  //       for (let o = 0; o < octaves; o++) {
  //         noiseValue +=
  //           Math.pow(octavesCoef, o + 1) *
  //           noise.perlin3(
  //             x / frequency[0] / Math.pow(octavesCoef, o),
  //             y / frequency[1] / Math.pow(octavesCoef, o),
  //             z / frequency[2] / Math.pow(octavesCoef, o)
  //           )
  //       }
  //
  //       const coef = 1 + Math.pow(octavesCoef, octaves)
  //
  //       const normalized = (noiseValue + coef) / (coef * 2) // 0 - 1
  //       const redistributed = Math.pow(normalized, redistribution)
  //
  //       layer.push(Math.round(redistributed))
  //     }
  //   }
  //
  //   emit('layer', new Uint8Array(layer).buffer)
  // }

  return true
}

registerWebworker(async ({ type, payload }, emit) => {
  if (type === 'init') {
    noise = new Noisejs.Noise(payload)

    return true
  }
  else if (type === 'genChunk3') {
    return genChunk3(payload, emit)
  }

  return false
})
