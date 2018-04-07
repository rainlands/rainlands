import * as THREE from 'three'
import MicroCache from 'microcache'

import blocks from '@resources/blocks'


const TextureLoader = new THREE.TextureLoader()
const microCache = new MicroCache()

export const loadMaterials = (blockID) => {
  let result
  let block = blocks[blockID]

  if (!block) {
    if (blockID > Math.max(...Object.keys(blocks))) {
      block = blocks[Math.max(...Object.keys(blocks))]
    }
    else {
      block = blocks[Math.min(...Object.keys(blocks))]
    }
  }

  if (Array.isArray(block.texture)) {
    const textures = microCache.getSet(
      block.name,
      block.texture.map((texture) => TextureLoader.load(texture.url ? texture.url : texture))
    )

    result = block.texture.map((_, i) => {
      const material = new THREE.MeshLambertMaterial(block.texture[i].options)

      material.map = textures[i]

      return material
    })
  }
  if (typeof block.texture === 'object') {
    result = new THREE.MeshLambertMaterial(block.texture.options)
    result.map = microCache.getSet(block.name, new THREE.TextureLoader().load(block.texture.url))
  }
  else {
    result = new THREE.MeshLambertMaterial()
    result.map = microCache.getSet(block.name, new THREE.TextureLoader().load(block.texture))
  }

  return result
}
