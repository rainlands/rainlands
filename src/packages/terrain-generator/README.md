# Terrain Generator

> Create your worlds seamlessly

### ⚠️ UNDER CONSTRUCTION ⚠️

Terrain generator allows you to create configurable terrain maps with tangled caves and ridge picks and provides friendly API with automatic dynamic chunk loading system.

## Usage

```js
import TerrainGenerator from 'terrain-generator';

const generator = new TerrainGenerator({
  seed: Math.random() * 100, // 1 - 65536
  height: 256, // chunk height
  chunkSize: 16, // chunk size
  caves: {
    frequency: 100, // zooming
    redistribution: 5, // Higher values make caves bigger and more solid
  },
  surface: {
    frequency: 150, // zooming
    redistribution: 3, // Higher values push middle elevations down into valleys
    minHeight: 120,
    maxHeight: 220,
  },
});

// provide callback for map updates
generator.onUpdate(({ chunks, added, removed }) => {
  // do something with map, e.g. render
});

// Update generator

generator.update({
  position: [0, 0], // position in 2D world
});
```

## Chunks structure

```js
const chunk = {
  '0': { // Y layer (depth)
    '0': { // X layer (width)
      '0': 0 // Z layer (height) - block ID on position [0, 0, 0] (3D)
    }
  }
  '1': {/* ... */},
  '2': {/* ... */}
}

const chunks = {
  '0': {
    '0': chunk // chunk on position [0, 0] (2D)
  }
}
```
