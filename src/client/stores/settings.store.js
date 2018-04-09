import { extendObservable } from 'mobx'


export default class SettingsStore {
  constructor() {
    extendObservable(this, {
      keymap: {
        snapLeft: 'command+left',
        deleteNode: ['del', 'backspace'],
      },
      game: {
        player: {
          speed: 0.12,
          fow: 70,
          near: 0.1,
          far: 1000,
          position: [0, 200, 0],
        },
        render: {
          renderDistance: 10,
          unrenderOffset: 5,
          useFrustrum: true,
          useDistanceTimeout: true,
        },
        renderer: {
          clearColor: '#EDEDF2',
        },
        chunksRenderer: {
          smoothChunksAppear: true,
        },
        scene: {
          fog: {
            color: '#EDEDF2',
            near: 8 * 16,
            far: 18 * 16,
          },
          helpers: {
            axes: 5,
          },
        },
        map: {
          seed: Math.random() * 1000,
          chunkDepth: 256,
          chunkSize: 16,
          updateInterval: 20,
          smoothChunksAppear: true,
          caves: {
            frequency: [100, 50, 100],
            redistribution: 0.5,
            octaves: 5,
            octavesCoef: 0.7,
          },
          surface: {
            frequency: [150, 150],
            redistribution: 4,
            octaves: 3,
            octavesCoef: 0.5,
            minHeight: 100,
            maxHeight: 200,
          },
        },
      },
    })
  }
}
