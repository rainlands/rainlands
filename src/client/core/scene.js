import * as THREE from 'three'


export const createScene = ({ fog, helpers }) => {
  const scene = new THREE.Scene()

  if (fog) {
    scene.fog = new THREE.Fog(fog.color, fog.near, fog.far)
  }

  if (helpers) {
    if (helpers.axes) {
      scene.add(new THREE.AxesHelper(helpers.axes))
    }
  }

  return scene
}
