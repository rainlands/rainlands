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
          speed: 1,
        },
        render: {
          renderDistance: 5,
          unrenderOffset: 2,
        },
        map: {
          seed: Math.random() * 100,
          depth: 100,
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
            minHeight: 5,
            maxHeight: 15,
          },
        },
      },
    })
  }
}
