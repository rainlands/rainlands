import * as THREE from 'three';
import { GAME_ROOT } from '!constants';

export default (x, y, z) => {
  const aspect = GAME_ROOT.offsetWidth / GAME_ROOT.offsetHeight;

  const camera = new THREE.PerspectiveCamera(60, aspect, 0.3, 200);

  camera.rotation.order = 'YXZ'; // XXX: IMPORTANT
  camera.position.set(x, y, z);

  camera.aspect = aspect;
  camera.updateProjectionMatrix();

  window.addEventListener('resize', () => {
    camera.aspect = GAME_ROOT.offsetWidth / GAME_ROOT.offsetHeight;
    camera.updateProjectionMatrix();
  });

  return camera;
};
