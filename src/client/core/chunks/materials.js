import * as THREE from 'three'
import MicroCache from 'microcache'

import blocks from '@resources/blocks'


const TextureLoader = new THREE.TextureLoader()
const microCache = new MicroCache()

const loadTexture = ({ url, material: materialOptions } = {}) => {
  const material = new THREE.MeshLambertMaterial(materialOptions)
  // material.blending = THREE.CustomBlending
  // material.blendSrc = THREE.OneFactor
  // material.blendDst = THREE.OneMinusSrcAlphaFactor

  const texture = microCache.getSet(url, TextureLoader.load(url))

  texture.magFilter = THREE.NearestFilter
  texture.minFilter = THREE.LinearMipMapLinearFilter

  material.map = texture

  return material
}

export const loadMaterials = (blockID) => {
  const block = blocks[blockID]

  if (Array.isArray(block.texture)) {
    return block.texture.map((t) => loadTexture(t))
  }
  return loadTexture(block.texture)
}
