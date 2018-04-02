import * as THREE from 'three';

export const createRenderer = ({ container, clearColor = '#212121' }) => {
  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
  });

  renderer.setClearColor(clearColor, 1);
  renderer.setSize(container.offsetWidth, container.offsetHeight);
  renderer.setPixelRatio(window.devicePixelRatio || 1);

  window.addEventListener('resize', () => {
    renderer.setSize(container.offsetWidth, container.offsetHeight);
  });

  container.appendChild(renderer.domElement);

  return renderer;
};
