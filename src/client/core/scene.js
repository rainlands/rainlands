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

  const dirLight = new THREE.DirectionalLight(0xFFFFFF, 0.7)

  dirLight.position.set(1, 2, 1.5)

  const hemiLight = new THREE.HemisphereLight(0xFFFFFF, 0xFFFFFF, 0.7)

  scene.add(dirLight)
  scene.add(hemiLight)

  return scene
}
