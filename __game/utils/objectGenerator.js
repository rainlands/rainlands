import * as THREE from 'three';

export default ({
  geometry,
  material,
  textureUrl,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  params,
}) => {
  rotation = rotation.map(s => s * (Math.PI / 180));

  if (textureUrl) {
    const texture = new THREE.TextureLoader().load(textureUrl);

    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(1024, 1024);

    material.map = texture;
  }

  const object = new THREE.Mesh(geometry, material);
  object.rotation.set(...rotation);
  object.position.set(...position.map(e => e + 0.5));

  Object.assign(object, params);

  return object;
};
