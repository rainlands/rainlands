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
          renderDistance: 1,
          unrenderOffset: 0,
        },
        map: {
          seed: 500,
          depth: 30,
          chunkSize: 16,
          caves: {
            frequency: 30,
            redistribution: 0.6,
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
