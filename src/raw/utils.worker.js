// worker.js
const registerWebworker = require('webworker-promise/lib/register')
const Noisejs = require('noisejs')


let noise

const genChunk3 = ({ position, size, depth, frequency, redistribution, octaves, octavesCoef }) => {
  const [xStart, zStart] = Object.values(position).map((v) => v * size)
  const [xEnd, zEnd] = Object.values(position).map((v) => v * size + size)

  const chunk = []

  for (let y = 0; y < depth; y++) {
    for (let x = xStart; x < xEnd; x++) {
      for (let z = zStart; z < zEnd; z++) {
        let noiseValue = 0

        for (let o = 0; o < octaves; o++) {
          noiseValue +=
            Math.pow(octavesCoef, o + 1) *
            noise.perlin3(
              x / frequency[0] / Math.pow(octavesCoef, o),
              y / frequency[1] / Math.pow(octavesCoef, o),
              z / frequency[2] / Math.pow(octavesCoef, o)
            )
        }

        const coef = 1 + Math.pow(octavesCoef, octaves)

        const normalized = (noiseValue + coef) / (coef * 2) // 0 - 1
        const redistributed = Math.pow(normalized, redistribution)

        chunk.push(Math.round(redistributed))
      }
    }
  }

  return new Uint8Array(chunk).buffer
}

registerWebworker(async ({ type, payload }) => {
  if (type === 'init') {
    noise = new Noisejs.Noise(payload)

    return true
  }
  else if (type === 'genChunk3') {
    return genChunk3(payload)
  }

  return false
})
