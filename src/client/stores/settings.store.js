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
          speed: 0.15,
          fow: 45,
          near: 0.3,
          far: 1000,
          position: [0, 20, 0],
        },
        render: {
          renderDistance: 5,
          unrenderOffset: 0,
          preloadOffset: 0,
        },
        map: {
          seed: Math.random() * 100,
          chunkDepth: 10,
          chunkSize: 16,
          caves: {
            frequency: [100, 50, 100],
            redistribution: 0.5,
            octaves: 5,
            octavesCoef: 0.7,
          },
          surface: {
            frequency: 100,
            redistribution: 1,
            octaves: 5,
            octavesCoef: 0.7,
            minHeight: 5,
            maxHeight: 15,
          },
        },
      },
    })
  }
}
