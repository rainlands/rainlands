// worker.js
const registerWebworker = require('webworker-promise/lib/register')
const Noisejs = require('noisejs')


let noise

const genChunk3 = ({ position, size, depth, frequency, redistribution }) => {
  const [xStart, zStart] = Object.values(position).map((v) => v * size)
  const [xEnd, zEnd] = Object.values(position).map((v) => v * size + size)

  const chunk = []

  for (let y = 0; y < depth; y++) {
    for (let x = xStart; x < xEnd; x++) {
      for (let z = zStart; z < zEnd; z++) {
        const noiseValue = noise.perlin3(x / frequency, y / frequency, z / frequency)

        const normalized = (noiseValue + 1) / 2 // 0 - 1
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
