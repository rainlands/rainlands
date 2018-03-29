import * as THREE from 'three';

export default () => {
  const scene = new THREE.Scene();

  scene.fog = new THREE.Fog(0x87cefa, 0, 200);
  scene.add(new THREE.AxesHelper(15));

  return scene;
};
