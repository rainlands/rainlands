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
          speed: 0.1,
          fow: 45,
          near: 0.3,
          far: 1000,
          position: [0, 250, 0],
        },
        render: {
          renderDistance: 5,
          unrenderOffset: 0,
          preloadOffset: 0,
        },
        map: {
          seed: 1234,
          chunkDepth: 256,
          chunkSize: 16,
          updateInterval: 500,
          caves: {
            frequency: [100, 50, 100],
            redistribution: 0.5,
            octaves: 5,
            octavesCoef: 0.7,
          },
          surface: {
            frequency: [500, 500],
            redistribution: 1,
            octaves: 6,
            octavesCoef: 0.5,
            minHeight: 100,
            maxHeight: 250,
          },
        },
      },
    })
  }
}
