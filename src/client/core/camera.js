import * as THREE from 'three'


const getAspect = (e) => e.offsetWidth / e.offsetHeight

export const createCamera = ({ container, fov, near, far, position }) => {
  const camera = new THREE.PerspectiveCamera(fov, getAspect(container), near, far)

  camera.rotation.order = 'YXZ' // XXX: IMPORTANT
  camera.position.set(...position)

  camera.aspect = getAspect(container)
  camera.updateProjectionMatrix()

  window.addEventListener('resize', () => {
    camera.aspect = getAspect(container)
    camera.updateProjectionMatrix()
  })

  return camera
}
